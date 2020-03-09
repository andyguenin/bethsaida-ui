import React, {ChangeEvent, Fragment} from 'react';
import Client from "../../data/Client";
import Env from "../../environment/Env";
import ReactBootstrap, {Modal, ModalBody, ModalFooter} from 'react-bootstrap'
import {ReactComponent} from "*.svg";
import ModalHeader from "react-bootstrap/ModalHeader";

interface Props {
    clients: Client[],
    summaryCount: number,
    sortFunction: (clients: Client[]) => Client[],
    filterFunction: (term: string, clients: Client[]) => Client[],
    selectFunction: (client: Client) => void,
    closeModal: () => void,
    show: boolean
}

interface State {
    filteredClients: Client[],
    clientSearchTerm?: string,
    showOnlySummary: boolean
}

export default class AttendanceModal extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            filteredClients: [],
            showOnlySummary: true
        }
    }


    private updateGridState = (showOnlySummary: boolean, searchTerm?: string): void => {
        let partialState: any = {};
        if (searchTerm === undefined || searchTerm === '') {
            partialState = {
                clientSearchTerm: undefined,
                showOnlySummary: true,
                filteredClients: []
            }
        } else {
            partialState = {
                clientSearchTerm: searchTerm,
                showOnlySummary,
                filteredClients: this.props.sortFunction(this.props.filterFunction(searchTerm, this.props.clients))
            }
        }
        const newState = Object.assign({}, this.state, partialState);
        this.setState(newState);
    };

    private clientSearch = (e: ChangeEvent<HTMLInputElement>): void => {
        const text = e.target.value;
        this.updateGridState(this.state.showOnlySummary, text);
    };

    private renderSingleClientRow = (client: Client) => {
        return <tr
            key={client.id}
            onClick={(e) => {
                this.updateGridState(true, undefined);
                this.props.selectFunction(client)
            }}>
            <td>
                <img src={Env.get().imageUrl + '/' + client.clientPhoto + '_250.png'}
                     alt={'photo of ' + client.fullName}/>
            </td>
            <td>{client.fullName}</td>
        </tr>
    }


    private renderClientGrid = (clients: Client[], searchTextEntered: boolean) => {
        if (clients.length === 0) {
            if (searchTextEntered) {
                return <i>No matching client found. They have either already been checked in, or have not been onboarded.</i>
            } else {
                return <i>Please search for a client by name</i>
            }
        } else {
            const rows = clients.slice(0, this.state.showOnlySummary ? this.props.summaryCount : clients.length).map(this.renderSingleClientRow);
            const table =
                <table className='table table-hover'>
                    <thead className='thead-dark'>
                    <tr>
                        <th>Photo</th>
                        <th>Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </table>

            const overflow = clients.length > this.props.summaryCount && this.state.showOnlySummary ?
                <div className='text-right'>
                    <button type='button' className='btn btn-outline-success' onClick={() => {
                        this.updateGridState(false, this.state.clientSearchTerm)
                    }}>
                        Show {clients.length - this.props.summaryCount} more results
                    </button>
                </div>
                : <Fragment/>

            return <Fragment>{table}{overflow}</Fragment>
        }
    }

    render() {
        return (
            <Modal show={this.props.show} size='xl'>
                    <ModalHeader>
                        <h5 className='modal-title'>Attendance Sign-In</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span onClick={this.props.closeModal}>&times;</span>
                        </button>
                    </ModalHeader>
                    <ModalBody>
                        <form>
                            <div className='form-group row '>
                                <div className='client-search col-sm-12'>
                                    <input type='text'
                                           className='form-control'
                                           id='client'
                                           placeholder='Search for Client'
                                           onChange={this.clientSearch}
                                           autoComplete="off"
                                    />
                                </div>
                            </div>
                        </form>
                        {this.renderClientGrid(this.state.filteredClients, this.state.clientSearchTerm !== undefined)}
                    </ModalBody>
                    <ModalFooter>
                        <button type="button" className='btn btn-info pointer' onClick={() => this.props.closeModal()}>Close
                        </button>
                        <button type="button" className="btn btn-primary">Sign In Client</button>
                    </ModalFooter>
                </Modal>)

    }
}