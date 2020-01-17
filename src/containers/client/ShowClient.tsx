import React, {Fragment} from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {GetSingleClient} from "../../services/Client";
import {withRouter, RouteChildrenProps} from 'react-router-dom'

const mapStateToProps = (state: AppState) => ({
    client: state.client,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        loadClient: (id: string) => dispatch(GetSingleClient(id))
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

interface RouteProps {
    id: string
}

type Props = PropsFromRedux & RouteChildrenProps<RouteProps> & {}

class ShowClient extends React.Component<Props> {

    componentDidMount(): void {
        if (this.props.match?.params) {
            this.props.loadClient(this.props.match?.params.id)
        }
    }

    render() {
        if (this.props.client.workingClient) {
            // @ts-ignore
            // @ts-ignore
            return (
                <Fragment>
                    <h1>{this.props.client.workingClient.fullName}</h1>
                    <div className='row profile-body'>
                        <div className='col-md-3 profile-side'>
                            <img width='100%' className='' src={this.props.client.workingClient.image}
                                 alt={'picture of ' + this.props.client.workingClient.fullName}/>
                            <h4 className='prof-attrib'>Date of birth: </h4>{this.props.client.workingClient.dateOfBirth.jsDate}
                            {this.props.client.workingClient.nicknames.length == 0 ?
                                null :
                                <Fragment>
                                    <h4 className='prof-attrib'>Nicknames:</h4>
                                    <ul>
                                    {this.props.client.workingClient.nicknames.map((r) => {
                                        return <li>{r}</li>
                                    })}
                                    </ul>
                                </Fragment>
                            }
                        </div>
                        <div className='col-md-9'>
                            <div className='text-right actions'>
                                <button onClick={() => window.location.href='/client/edit/' +
                                    (this.props.client.workingClient ?
                                            this.props.client.workingClient.id : ''
                                    )
                                } className='btn btn-warning'>Edit User</button>
                            </div>
                            <h3 className='text-right'>Recent Activity</h3>
                            <i>No recent user activity</i>
                        </div>
                    </div>
                    {/*<ModifyClient client={this.props.client.workingClient} />*/}
                </Fragment>
            )
        } else {
            return <Fragment/>
        }

    }
}

export default withRouter(connector(ShowClient))