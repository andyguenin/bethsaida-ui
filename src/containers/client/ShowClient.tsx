import React, {Fragment} from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {GetSingleClient} from "../../services/Client";
import {withRouter, RouteChildrenProps} from 'react-router-dom'
import FileContainer from "../../components/app/FileContainer";
import Client from "../../data/Client";
import ClientBuilder from "../../data/ClientBuilder";

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

interface IProps {
    client2?: Client
}

type Props = PropsFromRedux & RouteChildrenProps<RouteProps> & IProps

class ShowClient extends React.Component<Props> {

    componentDidMount(): void {
        if (this.props.match?.params) {
            this.props.loadClient(this.props.match?.params.id)
        }
    }

    render() {
        if (this.props.client2 !== undefined) {
            const client: Client = this.props.client2
            return (
                <FileContainer>
                    <h1>{client.fullName}</h1>
                    <div className='row profile-body'>
                        <div className='col-md-3 profile-side'>
                            <img width='100%' className='' src={client.photoId}
                                 alt={'picture of ' + client.fullName}/>
                            {/*{ client.dateOfBirth ? (<h4 className='prof-attrib'>Date of birth: </h4>{client.dateOfBirth.jsDate}) : (<Fragment />) }*/}

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
                        <div className='col-md-9'>
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