import React, {Fragment} from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import {withRouter, RouteChildrenProps} from 'react-router-dom'
import {Loader} from "../../components/app/loader/Loader";
import FileContainer from "../../components/app/FileContainer";
import {MergeClients, GetSingleClient, GetAllClients, GetClientEvents} from "../../services/Client";
import Client from "../../data/Client";
import User from "../../data/User";
import {GetAllUsers} from "../../services/User";
import ClientSelect from "../../components/app/ClientSelect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ShowClient from "./ShowClient";
import ClientPage from "../../components/client/ClientPage";
import Attendance from "../../data/Attendance";
import AttendanceData from "../../data/AttendanceData";
import ClientImage from "../../components/client/ClientImage";


const mapStateToProps = (state: AppState) => ({
    client: state.clientState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        mergeClient: (from: Client, to: Client, action: (c: string) => void) => dispatch(MergeClients(from, to, action)),
        getClient: (id: string, action: (c: Client) => void, users: User[]) => dispatch(GetSingleClient(id, action, users)),
        getAllClients: (update: (clients: Client[]) => void, users: User[]) => dispatch(GetAllClients(update, users)),
        getClientEvents: (id: string, action: (c: AttendanceData[]) => void) => dispatch(GetClientEvents(id, action)),
        loadUsers: (action: (user: User[]) => void) => dispatch(GetAllUsers(action))
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

interface IRoute {
}

interface State {
    clients?: Client[],
    users?: User[],
    fromClient?: Client,
    toClient?: Client,
    fromClientEvents?: AttendanceData[],
    toClientEvents?: AttendanceData[]

}

type Props = PropsFromRedux & RouteChildrenProps<IRoute> & {}

class MergeClient extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {}
    }

    componentDidMount(): void {
        this.props.loadUsers(users => {
            this.props.getAllClients(
                clients => {
                    this.setState((prev, props) => Object.assign({}, prev, {users, clients}))
                }, users
            )
        })
    }

    updateClient = (type: "from" | "to") => (client: Client | undefined) => {
        const clientKey: "fromClient" | "toClient" = type === "from" ? "fromClient" : "toClient"
        const eventKey: "fromClientEvents" | "toClientEvents" = type === "from" ? "fromClientEvents" : "toClientEvents"

        if (client !== undefined && client.id !== undefined) {
            this.props.getClientEvents(client.id, (events) => {
                this.setState((prev, props) => {
                        const updated: any = {}
                        updated[clientKey] = client
                        updated[eventKey] = events
                        return Object.assign({}, prev, updated)
                    }
                )
            })
        } else {
            this.setState((prev, props) => {
                const updated: any = {}
                updated[clientKey] = undefined
                updated[eventKey] = undefined
                return Object.assign({}, prev, updated)
            })
        }
    }

    renderButton = () => {
        const fromClient = this.state.fromClient
        const toClient = this.state.toClient
        if (fromClient !== undefined && toClient !== undefined) {
            return <button
                className='btn-success form-control'
                type='button'
                onClick={() => this.props.mergeClient(fromClient, toClient, (a) => {
                    window.location.href='/client/' + a;
                })}>
                Merge
            </button>
        } else {
            return <Fragment />
        }
    }

    public render() {
        return (
            <FileContainer>
                <Title name="Merge Clients">
                    {this.renderButton()}
                </Title>
                <Loader loading={this.state.users === undefined} isEmpty={this.state.users?.length === 0}
                        emptyText='No users found'>
                    <div className={'row'}>
                        <div className='col-5 text-center'>
                            <h2>Merge from and delete</h2>
                            <ClientSelect id='client-from' clients={(this.state.clients || []).filter(r => r.id !== this.state.toClient?.id)}
                                          action={this.updateClient("from")} selectedClient={this.state.fromClient}/>
                        </div>
                        <div className='col-2 text-center'>
                            <FontAwesomeIcon icon="arrow-right" size={'5x'}/>
                        </div>
                        <div className='col-5 text-center'>
                            <h2>Merge into</h2>
                            <ClientSelect id='client-to' clients={(this.state.clients || []).filter(r => r.id !== this.state.fromClient?.id)}
                                          action={this.updateClient("to")} selectedClient={this.state.toClient}/>
                        </div>
                        <div className={'row p-5'}>
                            <div className={'col-6 embedded-client-page'}>
                                <div className={'row'}>
                                    <div className={'col-12 ' + (this.state.fromClient === undefined ? 'd-none' : '')}>
                                        <ClientImage tpe={'photograph'} client={this.state.fromClient} />
                                    </div>
                                    <div className={'col-12'}>
                                        <ClientPage client={this.state.fromClient} events={this.state.fromClientEvents} gridCircleSize={7} id={'from-page'}/>
                                    </div>
                                </div>
                            </div>
                            <div className={'col-6 embedded-client-page'}>
                                <div className={'row'}>
                                    <div className={'col-12 ' + (this.state.toClient === undefined ? 'd-none' : '')}>
                                        <ClientImage tpe={'photograph'} client={this.state.toClient} />
                                    </div>
                                    <div className={'col-12'}>
                                        <ClientPage client={this.state.toClient} events={this.state.toClientEvents} gridCircleSize={7} id={'to-page'}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Loader>
            </FileContainer>
        )
    }
}

export default withRouter(connector(MergeClient))