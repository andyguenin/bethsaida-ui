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
        if(value !== undefined) {
            return (<tr>
                <td className='w-25'>{key}</td>
                <td className='text-right'>{value}</td>
            </tr>)
        }
    }

    render() {
        if (this.state.client !== undefined) {
            const client: Client = this.state.client;
            return (
                <FileContainer>
                    <h1>{client.fullName}</h1>
                    <div className='row profile-body'>
                        <div className='col-md-3 profile-side'>
                            <img width='100%' className='' src={Env.get().imageUrl + '/' + client.clientPhoto}
                                 alt={'picture of ' + client.fullName}/>

                            {/*{this.props.client.workingClient.nicknames.length === 0 ?*/}
                            {/*    null :*/}
                            {/*    <Fragment>*/}
                            {/*        <h4 className='prof-attrib'>Nicknames:</h4>*/}
                            {/*        <ul>*/}
                            {/*        {this.props.client.workingClient.nicknames.map((r) => {*/}
                            {/*            return <li>{r}</li>*/}
                            {/*        })}*/}
                            {/*        </ul>*/}
                            {/*    </Fragment>*/}
                            {/*}*/}
                        </div>
                        <div className='col-md-5'>
                            <table className='table table-bordered'>
                                <caption>Client Attributes</caption>
                                <thead className='thead-dark'>
                                        <th>Attribute</th>
                                        <th className='text-right'>Value</th>
                                </thead>
                                {this.displayAttributeRow('Date of Birth', this.state.client?.dateOfBirth.jsDate)}
                                {this.displayAttributeRow('Age', DateUtil.getAge(this.state.client?.dateOfBirth))}
                                {this.displayAttributeRow('Race', Race[this.state.client?.race].toString())}
                                {this.displayAttributeRow('Gender', Gender[this.state.client?.gender].toString())}
                                {this.displayAttributeRow('Intake Date', this.state.client?.intakeDate?.jsDate)}
                                <tr>
                                    <td>Photo ID</td>
                                    <td><img src={Env.get().imageUrl + '/' + this.state.client?.photoId} width='100%'/></td>
                                </tr>
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