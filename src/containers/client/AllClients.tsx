import React, {ChangeEvent, Fragment, MouseEventHandler} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AppState} from "../../reducers/AppState";
import {Loader} from "../../components/app/loader/Loader"
import './Client.scss';
import {AsyncDispatch} from "../../actions/Async";
import {DeleteClient, GetAllClients} from "../../services/Client";
import {Title} from "../../components/app/Title";
import Client from "../../data/Client";
import FileContainer from "../../components/app/FileContainer";
import Env from "../../environment/Env";
import Credentials from "../../data/Credentials";
import ClientBuilder from "../../data/ClientBuilder";
import {Gender} from "../../data/Gender";
import {Race} from "../../data/Race";
import DateUtil from "../../util/DateUtil";


const mapStateToProps = (state: AppState) => ({
    clientState: state.clientState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        loadAllClients: (updateFunc: (clients: Client[]) => void) => dispatch(GetAllClients(updateFunc)),
        deleteClient: (id: string, action: () => void) => dispatch(DeleteClient(id, action))
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
)
type PropsFromRedux = ConnectedProps<typeof connector>

// if we want to add in other props required for the tag that aren't part of the state
type Props = PropsFromRedux & {}

interface State {
    gridClients: Client[]
    loading: boolean
    filterText: string,
    viewBannedButtonText: string,
    showOnlyBannedClients: boolean
}

class AllClients extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            gridClients: [],
            loading: false,
            filterText: '',
            viewBannedButtonText: 'banned',
            showOnlyBannedClients: false
        }

        this.filterClientsAction = this.filterClientsAction.bind(this);
    }

    componentDidMount(): void {
        this.setState(Object.assign({}, this.state, {loading: true}));
        this.props.loadAllClients(this.updateGridClients);
    }

    // private deleteClick = (client: Client): void => {
    //     if (client.id !== undefined) {
    //         const confirmation = window.confirm('Are you sure you want to delete ' + client.fullName + '\'s client profile?');
    //         if (confirmation) {
    //             this.props.deleteClient(
    //                 client.id,
    //                 () => this.filterClients(this.state.filterText)
    //             )
    //         }
    //     }
    // }

    private updateGridClients = (clients: Client[]): void => {
        this.setState(
            Object.assign(
                {},
                this.state,
                {
                    loading: false,
                    gridClients: this.props.clientState.clientSortFunction(clients)
                }
            )
        )
    }

    private filterClients = (textInput: string) => {
        this.updateGridClients(
            this.props.clientState.clientFilterFunction(textInput,
                this.props.clientState.clients.filter((c) => c.isBanned || !this.state.showOnlyBannedClients))

        );
    }


    private toggleOnlyBannedClients = (): void => {
        this.setState((prevState, props) => Object.assign({}, prevState, {
            showOnlyBannedClients: !prevState.showOnlyBannedClients,
            viewBannedButtonText: prevState.showOnlyBannedClients ? 'banned' : 'all'
        }), () => {
            this.filterClients(this.state.filterText);
        })
    }

    private filterClientsAction = (e: ChangeEvent<HTMLInputElement>): void => {
        const text = e.target.value;
        this.setState(Object.assign({}, this.state, {filterText: text}));
        this.filterClients(text);
    }

    public render() {
        return (
            <FileContainer>
                <Title name={(this.state.showOnlyBannedClients ? 'Banned ' : '') + 'Client Management'}>
                    <button type='button' className='btn btn-success form-control'
                            onClick={() => window.location.href = '/client/new'}>New Client
                    </button>
                    <button type='button' className='btn btn-danger form-control' onClick={this.toggleOnlyBannedClients}>
                        View {this.state.viewBannedButtonText} clients
                    </button>
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Search Client'
                        onChange={this.filterClientsAction}
                    />
                </Title>
                <Loader
                    loading={this.state.loading}
                    isEmpty={this.state.gridClients.length === 0}
                    emptyText='Cannot find any matching clients.'
                >
                    <div className='col-md-12'>
                        <table className="table table-striped client-table table-hover">
                            <thead className='thead-dark'>
                            <tr>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Race</th>
                                <th>Age</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.gridClients.map(c => this.singleRow(c))}
                            </tbody>
                        </table>
                    </div>
                </Loader>
            </FileContainer>
        );
    }

    private singleRow(client: Client) {
        return (
            <tr className={'clickable-row ' + (client.isBanned ? 'banned-row' : '')} key={client.id} onClick={() => {
                window.location.href = '/client/' + client.id
            }}>
                <td>
                    {client.fullName}
                </td>
                <td>
                    {Gender[client.gender]}
                </td>
                <td>
                    {Race[client.race]}
                </td>
                <td>
                    {DateUtil.getAge(client.dateOfBirth)}
                </td>
            </tr>
        )
    }
}


export default connector(AllClients)