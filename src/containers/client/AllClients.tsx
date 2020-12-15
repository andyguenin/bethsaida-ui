import React, {ChangeEvent, Fragment} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AppState} from "../../reducers/AppState";
import {Loader} from "../../components/app/loader/Loader"
import './Client.scss';
import {AsyncDispatch} from "../../actions/Async";
import {DeleteClient, GetAllClients} from "../../services/Client";
import {Title} from "../../components/app/Title";
import Client from "../../data/Client";
import FileContainer from "../../components/app/FileContainer";
import {Gender} from "../../data/Gender";
import {Race} from "../../data/Race";
import DateUtil from "../../util/DateUtil";
import {formatEnum} from "../../util/StringUtil";
import {clientFilterFunc, clientSortFunc} from '../../util/ClientUtil';
import User from "../../data/User";
import {GetAllUsers} from "../../services/User";


const mapStateToProps = (state: AppState) => ({
    clientState: state.clientState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        loadAllClients: (updateFunc: (clients: Client[]) => void, users: User[]) => dispatch(GetAllClients(updateFunc, users)),
        deleteClient: (id: string, action: () => void) => dispatch(DeleteClient(id, action)),
        getAllUsers: (action: (users: User[]) => void) => dispatch(GetAllUsers(action))
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
    showOnlyBannedClients: boolean,

    page: number,
    perpage: number,
    show: Client[],
    maxpage: number
}

class AllClients extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            gridClients: [],
            loading: false,
            filterText: '',
            viewBannedButtonText: 'Banned',
            showOnlyBannedClients: false,

            page: 0,
            perpage: 10,
            show: [],
            maxpage: 0
        }

        this.filterClientsAction = this.filterClientsAction.bind(this);
    }

    componentDidMount(): void {
        this.props.getAllUsers((users) => {
            this.setState(Object.assign({}, this.state, {loading: true}), () => {
                this.props.loadAllClients(this.updateGridClients, users);
            })
        })
    }

    private updateGridClients = (clients: Client[]): void => {
        this.setState(
            Object.assign(
                {},
                this.state,
                {
                    loading: false,
                    gridClients: clientSortFunc(clients)
                }
            ),
            () => this.setPage(0)
        )
    }

    private filterClients = (textInput: string) => {
        this.updateGridClients(
            clientFilterFunc(textInput, this.props.clientState.clients.filter((c) => c.isBanned || !this.state.showOnlyBannedClients))
        );
    }


    private toggleOnlyBannedClients = (): void => {
        this.setState((prevState, props) => Object.assign({}, prevState, {
            showOnlyBannedClients: !prevState.showOnlyBannedClients,
            viewBannedButtonText: prevState.showOnlyBannedClients ? 'Banned' : 'All'
        }), () => {
            this.filterClients(this.state.filterText);
        })
    }

    private filterClientsAction = (e: ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault()
        const text = e.target.value;
        this.setState(Object.assign({}, this.state, {filterText: text}));
        this.filterClients(text);
    }

    private setPage = (page: number): void => {
        this.setState(Object.assign({}, this.state, {
            page,
            show: this.state.showOnlyBannedClients ? this.state.gridClients : this.state.gridClients.slice(page * this.state.perpage, (page + 1) * this.state.perpage),
            maxpage: Math.floor(this.state.gridClients.length / this.state.perpage)
        }))
    }

    private separatePageControls = () => {
        return (
            <div className='d-inline d-lg-none'>
                <div className={'text-center full'}>
                    <button
                        type='button'
                        onClick={() => (this.state.page !== 0) ? this.setPage(this.state.page - 1) : undefined}
                        className={'btn btn-info ' + (this.state.page === 0 ? 'disabled' : '')}
                    >&lt; Previous
                    </button>
                    &nbsp;&nbsp;&nbsp;
                    Page {this.state.page + 1} / {this.state.maxpage + 1}
                    &nbsp;&nbsp;&nbsp;
                    <button
                        type='button'
                        onClick={() => (this.state.page !== this.state.maxpage) ? this.setPage(this.state.page + 1) : undefined}
                        className={'btn btn-info ' + (this.state.page === this.state.maxpage ? 'disabled' : '')}>Next &gt;</button>
                </div>
            </div>
        )
    }

    private inlinePageControls = () => {
        return (
            <div className='d-none d-lg-inline'>
                <button
                    type='button'
                    onClick={() => (this.state.page !== 0) ? this.setPage(this.state.page - 1) : undefined}
                    className={'btn btn-info ' + (this.state.page === 0 ? 'disabled' : '')}
                >&lt; Previous
                </button>
                &nbsp;&nbsp;&nbsp;
                Page {this.state.page + 1} / {this.state.maxpage + 1}
                &nbsp;&nbsp;&nbsp;
                <button
                    type='button'
                    onClick={() => (this.state.page !== this.state.maxpage) ? this.setPage(this.state.page + 1) : undefined}
                    className={'btn btn-info ' + (this.state.page === this.state.maxpage ? 'disabled' : '')}>Next &gt;</button>
            </div>
        )
    }

    private getHeader = () => {
        if (this.state.showOnlyBannedClients) {
            return <tr>
                <th></th>
                <th>Information</th>
            </tr>
        } else {
            return <tr>
                <th>{this.inlinePageControls()}</th>
                <th>Name</th>
                <th className='d-none d-lg-table-cell'>Gender</th>
                <th className='d-none d-lg-table-cell'>Race</th>
                <th className='d-none d-lg-table-cell'>Secondary Race</th>
                <th className='d-none d-lg-table-cell'>Hispanic</th>
                <th className='d-none d-lg-table-cell'>Age</th>
            </tr>
        }
    }

    public render() {
        return (
            <FileContainer>
                <Title name={'Client Management'}>
                    <button type='button' className='btn btn-success form-control'
                            onClick={() => window.location.href = '/client/new'}>New Client
                    </button>
                    <button type='button' className='btn btn-danger form-control'
                            onClick={this.toggleOnlyBannedClients}>
                        {this.state.viewBannedButtonText} Clients
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
                    <div className='col-12'>
                        {this.separatePageControls()}
                    </div>
                    <div className='col-12'>
                        <table className="table table-striped client-table table-hover">
                            <thead className='thead-dark'>
                            {this.getHeader()}
                            </thead>
                            <tbody>
                            {this.state.show.map(c => this.singleRow(c))}
                            </tbody>
                        </table>
                        <div className='col-12'>
                            {this.separatePageControls()}
                        </div>
                    </div>
                </Loader>
            </FileContainer>
        );
    }

    private singleRow(client: Client) {
        if (this.state.showOnlyBannedClients) {
            return <tr className={'clickable-row '} key={client.id}
                       onClick={() => {
                           window.location.href = '/client/' + client.id
                       }}>
                <td>
                    {client.smallImageTag()}
                </td>
                <td>
                    <table>
                        <tr>
                            <td>Name</td>
                            <td>{client.fullName}</td>
                        </tr>
                        <tr>
                            <td>Age</td>
                            <td>{DateUtil.getAge(client.dateOfBirth)}</td>
                        </tr>
                        <tr>
                            <td>Gender</td>
                            <td>{formatEnum(Gender[client.gender])}</td>
                        </tr>
                        <tr>
                            <td>Race</td>
                            <td>{formatEnum(Race[client.race])}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        } else {
            return (
                <tr className={'clickable-row ' + (client.isBanned ? 'banned-row' : '')} key={client.id}
                    onClick={() => {
                        window.location.href = '/client/' + client.id
                    }}>
                    <td>
                        {client.smallImageTag()}
                    </td>
                    <td>
                        {client.fullName}
                    </td>
                    <td className='d-none d-lg-table-cell'>
                        {formatEnum(Gender[client.gender])}
                    </td>
                    <td className='d-none d-lg-table-cell'>
                        {formatEnum(Race[client.race])}
                    </td>
                    <td className='d-none d-lg-table-cell'>
                        {(client.raceSecondary !== undefined && client.raceSecondary !== Race.NOT_APPLICABLE) ? formatEnum(Race[client.raceSecondary]) : ''}
                    </td>
                    <td className='d-none d-lg-table-cell'>
                        {client.hispanic ? 'Yes' : ''}
                    </td>
                    <td className='d-none d-lg-table-cell'>
                        {DateUtil.getAge(client.dateOfBirth)}
                    </td>
                </tr>
            )
        }
    }
}


export default connector(AllClients)