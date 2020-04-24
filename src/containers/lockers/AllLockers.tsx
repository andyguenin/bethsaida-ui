import React, {ChangeEvent, FormEvent, Fragment, RefObject} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import FileContainer from "../../components/app/FileContainer";
import {Title} from "../../components/app/Title";
import {Loader} from "../../components/app/loader/Loader";
import {EndLockerAssignment, GetAllLockers, PutLocker} from "../../services/Locker";
import Locker from "../../data/Locker";
import Client from "../../data/Client";
import {GetAllClients} from "../../services/Client";
import ClientSelect from "../../components/app/ClientSelect";
import LockerBuilder from "../../data/LockerBuilder";
import BDate from "../../data/BDate";
import FormModal from "../../components/app/FormModal";
import ErrorMessage from "../../components/app/ErrorMessage";
import User from "../../data/User";
import {GetAllUsers} from "../../services/User";
import UserSelect from "../../components/app/UserSelect";
import Credentials from "../../data/Credentials";


const mapStateToProps = (state: AppState) => ({
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        getAllLockers: (action: (l: Locker[]) => void, clients: Client[], users: User[]) => dispatch(GetAllLockers(action, clients, users)),
        putLocker: (locker: Locker, action: () => void) => dispatch(PutLocker(locker, action)),
        endLockerAssignment: (id: String, date: Date, action: () => void) => dispatch(EndLockerAssignment(id, date, action)),
        getAllClients: (action: (c: Client[]) => void, users: User[]) => dispatch(GetAllClients(action, users)),
        getAllUsers: (action: (u: User[]) => void) => dispatch(GetAllUsers(action))
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}

interface State {
    loading: boolean
    showAddModal: boolean
    showCloseModal: boolean
    lockers: Locker[]
    allClients: Client[]
    availableClients: Client[]
    lockerBuilder: LockerBuilder
    users: User[]
    modalError?: string
    currentUser?: User
}

class AllLockers extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: true,
            showAddModal: false,
            showCloseModal: false,
            lockers: [],
            allClients: [],
            availableClients: [],
            users: [],
            lockerBuilder: LockerBuilder.emptyBuilder()
        }
    }

    private toggleAddModal = (show: boolean) => {
        this.setState((state, props) => Object.assign({}, state, {showAddModal: show, modalError: undefined}))
    }

    private toggleCloseModal = (show: boolean) => {
        this.setState((state, props) => Object.assign({}, state, {showCloseModal: show, modalError: undefined}))
    }

    componentDidMount(): void {
        this.updateLockers()
    }

    private updateLockers = () => {
        this.props.getAllUsers((users) => {
            this.props.getAllClients((clients) => {
                const currentUser = users.find((c) => c.id === new Credentials().getId())
                this.setState((state, props) =>
                        Object.assign({}, state, {
                            allClients: clients,
                            users,
                            lockerBuilder: LockerBuilder.emptyBuilder().setInputUser(currentUser),
                            currentUser
                        }),
                    () => this.props.getAllLockers((lockers) => {
                        this.setState((state, props) => {
                            const lockerClients = lockers.map(l => l.client)
                            const availableClients = state.allClients.filter(c => lockerClients.find(lc => lc.id === c.id) === undefined)
                            return Object.assign({}, state, {
                                lockers: lockers.sort((a, b) => a.lockerNumber - b.lockerNumber),
                                loading: false,
                                showAddModal: false,
                                showCloseModal: false,
                                availableClients
                            })
                        })
                    }, this.state.allClients, this.state.users)
                )
            }, users)
        })
    }

    private lockerForm = (fe: FormEvent<HTMLFormElement>): void => {
        fe.preventDefault()
        const existingLocker = this.state.lockers.find(l => l.lockerNumber.toString() === this.state.lockerBuilder.lockerNumber)
        if (existingLocker !== undefined) {
            this.setState((state, props) => Object.assign({}, state, {modalError: existingLocker.client.fullName + ' has already been assigned to this locker.'}))
        } else {
            try {
                const build = this.state.lockerBuilder.build()
                this.props.putLocker(build, this.updateLockers)
            } catch (ex) {
                this.setState((state, props) => Object.assign({}, state, {modalError: 'Could not create locker record. Did you fill out all of the fields?'}))
            }
        }

    }

    private lockerCloseForm = (fe: FormEvent<HTMLFormElement>): void => {
        fe.preventDefault()
        try {
            this.props.endLockerAssignment(this.state.lockerBuilder.id || '', new Date(this.state.lockerBuilder.endDate || ''), this.updateLockers)
        } catch (ex) {
            this.setState((state, props) => Object.assign({}, state, {modalError: 'Could not end locker assignment.'}))
        }
    }

    private onLockerUpdate(field: string): (e: ChangeEvent<HTMLInputElement>) => void {
        return (e) => {
            const value = e.target.value
            this.setState((state, props) => {
                    let newState = state.lockerBuilder.setField(field, value)
                    if (field === "startDate") {
                        let date = new Date(value)
                        date.setDate(date.getDate() + 90)
                        newState = newState.setField("expectedEndDate", BDate.fromDate(date).jsDate)
                    }
                    return Object.assign(
                        {},
                        state,
                        {
                            lockerBuilder: newState
                        }
                    )
                }
            )
        }
    }

    private setClient = (c?: Client) => {
        this.setState((state, props) =>
            Object.assign(
                {},
                state,
                {
                    lockerBuilder: state.lockerBuilder.setClient(c)
                }
            )
        )
    }

    private setIntakeUser = (u?: User) => {
        this.setState((state, props) =>
            Object.assign({}, state, {lockerBuilder: state.lockerBuilder.setInputUser(u)}))
    }

    private renderSingleRow = (locker: Locker) => {
        const isExpired = new Date() > locker.expectedEndDate
        return (
            <tr key={'locker-' + locker.id} className={(isExpired ? 'error-background' : '')}>
                <td>{locker.lockerNumber}</td>
                <td><a href={'/client/' + locker.client.id}>{locker.client.fullName}</a></td>
                <td>{locker.startDate.toDateString()}</td>
                {
                    (() => {
                            if (isExpired) {
                                return <td><b>{locker.expectedEndDate.toDateString()}</b></td>
                            } else {
                                return <td>{locker.expectedEndDate.toDateString()}</td>
                            }
                        }
                    )()
                }
                <td>{locker.inputUser.getFullName()}</td>
                <td>
                    <button type='button' className='btn btn-danger' onClick={
                        () => this.setState((state, props) => Object.assign({}, state, {
                            lockerBuilder: LockerBuilder.load(locker).setEndDate(BDate.fromDate(new Date()).jsDate),
                            showCloseModal: true
                        }))
                    }>Remove Assignment
                    </button>
                </td>
            </tr>
        )
    }


    public render() {
        return (
            <FileContainer>
                <Title name='Lockers'>
                    <button type='button' className='btn btn-success' onClick={() => this.toggleAddModal(true)}>Add
                        Locker Assignment
                    </button>
                </Title>
                <FormModal
                    show={this.state.showCloseModal}
                    close={() => this.toggleCloseModal(false)}
                    title='Remove Client Assignment'
                    onSubmit={this.lockerCloseForm}
                    submitButton={true}
                >
                    <div className='form-group row'>
                        <label htmlFor='end_date' className='col-sm-2'>Assignment End Date</label>
                        <div className={'col-sm-10'}>
                            <input type='date' className='form-control' id='end_date'
                                   placeholder='End Date'
                                   value={this.state.lockerBuilder.endDate}
                                   onChange={this.onLockerUpdate("endDate")}
                                   autoComplete="off"
                            />
                        </div>
                    </div>

                </FormModal>

                <FormModal
                    show={this.state.showAddModal}
                    close={() => this.toggleAddModal(false)}
                    title='Add Locker Assignment'
                    submitButton={true}
                    onSubmit={this.lockerForm}
                >
                    <ErrorMessage errorMessage={this.state.modalError}/>

                    <div className='form-group row'>
                        <label htmlFor='client' className='col-sm-2'>Client</label>
                        <div className='col-sm-10'>

                            <ClientSelect
                                id='client'
                                clients={this.state.availableClients}
                                action={this.setClient}
                                selectedClient={this.state.lockerBuilder.client}
                            />
                        </div>
                    </div>
                    <div className='form-group row'>
                        <label htmlFor='locker_num' className='col-sm-2'>Locker Number</label>
                        <div className={'col-sm-10'}>
                            <input type='text' inputMode='numeric' pattern="[0-9]*" className='form-control'
                                   id='locker_num'
                                   placeholder='Locker Number'
                                   value={this.state.lockerBuilder.lockerNumber}
                                   onChange={this.onLockerUpdate('lockerNumber')}
                                   autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className='form-group row'>
                        <label htmlFor='start_date' className='col-sm-2'>Start Date</label>
                        <div className={'col-sm-10'}>
                            <input type='date' className='form-control' id='start_date'
                                   placeholder='Start Date'
                                   value={this.state.lockerBuilder.startDate}
                                   onChange={this.onLockerUpdate('startDate')}
                                   autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className='form-group row'>
                        <label htmlFor='expected_end_date' className='col-sm-2'>Expected End Date</label>
                        <div className={'col-sm-10'}>
                            <input type='date' className='form-control' id='expected_end_date'
                                   placeholder='Expected End Date'
                                   value={this.state.lockerBuilder.expectedEndDate}
                                   onChange={this.onLockerUpdate('expectedEndDate')}
                                   autoComplete="off"
                            />
                        </div>
                    </div>
                    <div className='form-group row'>
                        <label htmlFor='user' className='col-sm-2'>Intake Employee</label>
                        <div className='col-sm-10'>
                            {
                                (
                                    () => {

                                        if (this.state.lockerBuilder.inputUser === undefined) {
                                            return <UserSelect
                                                id='user'
                                                users={this.state.users}
                                                action={this.setIntakeUser}
                                            />
                                        } else {

                                            return <div className='input-group'>
                                                <input className='form-control disabled' disabled={true}
                                                       value={this.state.lockerBuilder.inputUser.getFullName()}
                                                />
                                                <div className='input-group-append'>
                                                    <div className='input-group-text pointer' onClick={
                                                        () => {
                                                            this.setIntakeUser(undefined);
                                                        }
                                                    }>Clear
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    }
                                )()
                            }
                        </div>
                    </div>
                </FormModal>
                <Loader emptyText='No lockers have been assigned' isEmpty={this.state.lockers.length === 0 && false}
                        loading={this.state.loading}>
                    <table className='table table-hover'>
                        <thead className='thead-dark'>
                        <tr>
                            <th>Locker Number</th>
                            <th>Client</th>
                            <th>Start Date</th>
                            <th>Expected End Date</th>
                            <th>Assignment Employee</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.lockers.map(this.renderSingleRow)}
                        </tbody>
                    </table>
                </Loader>
            </FileContainer>
        )
    }
}


export default connector(AllLockers)