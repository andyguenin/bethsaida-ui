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
            viewBannedButtonText: 'banned',
            showOnlyBannedClients: false,

            page: 0,
            perpage: 10,
            show: [],
            maxpage: 0
        }

        this.filterClientsAction = this.filterClientsAction.bind(this);
    }

    componentDidMount(): void {
        this.setState(Object.assign({}, this.state, {loading: true}));
        this.props.loadAllClients(this.updateGridClients);
    }

    private updateGridClients = (clients: Client[]): void => {
        this.setState(
            Object.assign(
                {},
                this.state,
                {
                    loading: false,
                    gridClients: this.props.clientState.clientSortFunction(clients)
                }
            ),
            () => this.setPage(0)
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
        e.preventDefault()
        const text = e.target.value;
        this.setState(Object.assign({}, this.state, {filterText: text}));
        this.filterClients(text);
    }

    private setPage = (page: number): void => {
        this.setState(Object.assign({}, this.state, {
            page,
            show: this.state.gridClients.slice(page * this.state.perpage, (page + 1) * this.state.perpage),
            maxpage: Math.floor(this.state.gridClients.length / this.state.perpage)
        }))
    }

    private pageControls = () => {
        return (
            <Fragment>
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
            </Fragment>
        )
    }

    public render() {
        return (
            <FileContainer>
                <Title name={(this.state.showOnlyBannedClients ? 'Banned ' : '') + 'Client Management'}>
                    <button type='button' className='btn btn-success form-control'
                            onClick={() => window.location.href = '/client/new'}>New Client
                    </button>
                    <button type='button' className='btn btn-danger form-control'
                            onClick={this.toggleOnlyBannedClients}>
                        View {this.state.viewBannedButtonText} clients
                    </button>
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Search Client'
                        onChange={this.filterClientsAction}
                    />
                    <div className='d-small-inline d-lg-none'>
                        {this.pageControls()}
                    </div>
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
                                <th>Secondary Race</th>
                                <th>Hispanic</th>
                                <th>Age</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.show.map(c => this.singleRow(c))}
                            </tbody>
                        </table>
                        <div className='d-sm-none d-lg-flex row padding-bottom-15'>
                            <div className='col-12 text-center'>
                                {this.pageControls()}
                            </div>

                        </div>
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
                    {formatEnum(Gender[client.gender])}
                </td>
                <td>
                    {formatEnum(Race[client.race])}
                </td>
                <td>
                    {(client.raceSecondary !== undefined && client.raceSecondary !== Race.NOT_APPLICABLE) ? formatEnum(Race[client.raceSecondary]) : ''}
                </td>
                <td>
                    {client.hispanic ? 'Yes' : ''}
                </td>
                <td>
                    {DateUtil.getAge(client.dateOfBirth)}
                </td>
            </tr>
        )
    }
}


export default connector(AllClients)