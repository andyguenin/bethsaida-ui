import React from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {GetSingleClient} from "../../services/Client";
import {withRouter, RouteChildrenProps} from 'react-router-dom'
import FileContainer from "../../components/app/FileContainer";
import Client from "../../data/Client";
import Env from "../../environment/Env";
import DateUtil from "../../util/DateUtil";
import {Race} from "../../data/Race";
import {Gender} from "../../data/Gender";
import {Title} from "../../components/app/Title";

const mapStateToProps = (state: AppState) => ({
    clientState: state.clientState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        getSingleClient: (id: string, action: (c: Client) => void) => dispatch(GetSingleClient(id, action))
    };
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

interface RouteProps {
    id: string
}

interface IState {
    client?: Client
}

type Props = PropsFromRedux & RouteChildrenProps<RouteProps>

class ShowClient extends React.Component<Props, IState> {

    constructor(props: Props) {
        super(props);

        this.state = {
            client: undefined
        }

    }

    componentDidMount(): void {
        if (this.props.match?.params) {
            this.props.getSingleClient(this.props.match?.params.id, (c: Client) => {
                this.setState({client: c})
            })
        }
    }

    private displayAttributeRow(key: string, value?: string): any {
        if (value !== undefined) {
            return (<tr>
                <td className='w-25'>{key}</td>
                <td className='text-right'>{value}</td>
            </tr>)
        }
    }

    private displayImage(imageType: string, name: string, imageTag?: string) {
        if (imageTag !== undefined && imageTag !== '') {
            return (<img width='100%'
                         src={Env.get().imageUrl + '/' + imageTag + '_250.png'}
                         alt={imageType.charAt(0).toUpperCase() + imageType.slice(1) + ' of ' + name}/>)
        } else {
            return (<b>No {imageType} found for {name}</b>)

        }
    }

    render() {
        if (this.state.client !== undefined) {
            const client: Client = this.state.client;
            return (
                <FileContainer>
                    <Title name={client.fullName}>
                        <button
                            className='btn btn-success'
                            type='button'
                            onClick={() => window.location.href='/client/' + (this.state.client?.id || '') + '/edit'}>
                        Edit</button>
                        <button className='btn btn-danger' type='button'>Ban From DDB Services</button>

                    </Title>
                    <div className='row profile-body'>
                        <div className='col-md-3 profile-side'>
                            {this.displayImage('photograph', client.fullName, client.clientPhoto)}
                        </div>
                        <div className='col-md-5'>
                            <table className='table table-bordered'>
                                <caption>Client Attributes</caption>
                                <thead className='thead-dark'>
                                <tr>
                                    <th>Attribute</th>
                                    <th className='text-right'>Value</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.displayAttributeRow('Date of Birth', this.state.client?.dateOfBirth.jsDate)}
                                {this.displayAttributeRow('Age', DateUtil.getAge(this.state.client?.dateOfBirth))}
                                {this.displayAttributeRow('Race', Race[this.state.client?.race].toString())}
                                {this.displayAttributeRow('Gender', Gender[this.state.client?.gender].toString())}
                                {this.displayAttributeRow('Intake Date', this.state.client?.intakeDate?.jsDate)}
                                {this.displayAttributeRow('Intake User', this.state.client?.intakeUser)}
                                <tr>
                                    <td>Photo ID</td>
                                    <td>{this.displayImage('photo id scan', client.fullName, client.photoId)}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='col-md-4'>
                            <div className='text-right actions'>
                                {/*<button onClick={() => window.location.href='/client/edit/' +*/}
                                {/*    (this.props.client.workingClient ?*/}
                                {/*            this.props.client.workingClient.id : ''*/}
                                {/*    )*/}
                                {/*} className='btn btn-warning'>Edit User</button>*/}
                            </div>
                            <h3 className='text-right'>Recent Activity</h3>
                            <i>No recent user activity</i>
                        </div>
                    </div>
                    {/*<ModifyClient client={this.props.client.workingClient} />*/}
                </FileContainer>
            )
        } else {
            return <FileContainer/>
        }

    }
}

export default withRouter(connector(ShowClient))