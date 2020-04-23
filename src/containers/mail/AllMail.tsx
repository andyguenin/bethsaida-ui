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
import MailRecord from "../../data/MailRecord";
import {EndMailAssignment, GetAllMailRecords, PutMailRecord} from "../../services/Mail";
import {clientCompareFunction, clientSortFunc} from "../../util/ClientUtil";


const mapStateToProps = (state: AppState) => ({
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        getAllClients: (action: (c: Client[]) => void, users: User[]) => dispatch(GetAllClients(action, users)),
        getAllUsers: (action: (u: User[]) => void) => dispatch(GetAllUsers(action)),
        getAllMailRecords: (action: (m: MailRecord[]) => void, clients: Client[], users: User[]) => dispatch(GetAllMailRecords(action, clients, users)),
        putMailRecord: (rec: MailRecord, action: () => void) => dispatch(PutMailRecord(rec, action)),
        endMailAssignment: (id: string, date: Date, action: () => void) => dispatch(EndMailAssignment(id, date, action))
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}

interface RecordBuilder {
    client?: Client,
    user?: User,
    date?: Date
}

interface State {
    loading: boolean
    mailClients: MailRecord[]
    mailClientBuilder: RecordBuilder
    showAddModal: boolean
    allClients: Client[]
    availableClients: Client[]
    users: User[]
    currentUser?: User
    modalError?: string,
    showCloseModal: boolean,
    endDate: string,
    closeUserId: string

}

class AllMail extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: true,
            mailClients: [],
            mailClientBuilder: {},
            showAddModal: false,
            allClients: [],
            availableClients: [],
            users: [],
            showCloseModal: false,
            endDate: BDate.fromDate(new Date()).jsDate,
            closeUserId: ''
        }
    }

    componentDidMount(): void {
        this.reload()
    }

    public reload = (afterAction: () => void = () => undefined) => {
        this.props.getAllUsers((users) => {
            this.props.getAllClients((clients) => {
                this.props.getAllMailRecords((allRecords) => {
                    const availableClients = clients.filter(c => allRecords.find(r => r.client.id === c.id) === undefined)
                    allRecords.sort((a, b) => clientCompareFunction(a.client, b.client))
                    this.setState((state, props) => Object.assign({}, state, {
                        loading: false,
                        mailClients: allRecords,
                        allClients: clientSortFunc(clients),
                        availableClients,
                        users: users,
                        showAddModal: false,
                        showCloseModal: false,
                    }), this.clearMailClientBuilder)
                }, clients, users)
            }, users)
        })
    }

    private clearMailClientBuilder = () => {
        this.setState((state, props) => {
            const currentUser = state.users.find((c) => c.id === new Credentials().getId())
            return Object.assign({}, state, {
                mailClientBuilder: {user: currentUser},
                endDate: BDate.fromDate(new Date()).jsDate,
                closeUserId: ''
            })
        })
    }

    private toggleAddModal = (show: boolean) => {
        this.setState((state, props) => Object.assign({}, state, {showAddModal: show}),  () => {
            if (show) {
                this.clearMailClientBuilder()
            }
        })
    }

    private toggleCloseModal = (show: boolean, userId?: string) => {
        this.setState((state, props) => Object.assign({}, state, {
            showCloseModal: show,
            closeUserId: (userId || '')
        }), () => {
            if (!show) {
                this.clearMailClientBuilder()
            }
        })
    }


    private setClient = (client?: Client) => {
        this.setState((state, props) => Object.assign({}, state, {mailClientBuilder: Object.assign({}, state.mailClientBuilder, {client})}))
    }

    private setEndDate = (v: ChangeEvent<HTMLInputElement>): void => {
        const endDate = v.target.value
        this.setState((state, props) => Object.assign({}, state, {
            endDate: endDate
        }))
    }

    private setDate = (date?: Date) => {
        this.setState(
            (state, props) =>
                Object.assign({}, state, {mailClientBuilder: Object.assign({}, state.mailClientBuilder, {date})})
        )
    }

    private setUser = (user?: User) => {
        this.setState((state, props) => Object.assign({}, state, {mailClientBuilder: Object.assign({}, state.mailClientBuilder, {user})}))
    }

    private submitForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const rb = this.state.mailClientBuilder
        if (rb.date === undefined || rb.user === undefined || rb.client === undefined) {
            this.setState((state, props) => Object.assign({}, state, {modalError: 'Please fill out all records.'}))
        } else {
            const mr = new MailRecord('', rb.client, rb.user, rb.date)
            this.props.putMailRecord(mr, () => {
                this.setState((state, props) => Object.assign({}, state, {
                    showAddModal: false
                }), this.reload)
            })
        }
    }

    private lockerCloseForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        this.props.endMailAssignment(this.state.closeUserId, new Date(this.state.endDate), () => {
            this.reload()
        })
    }

    private renderRow = (r: MailRecord) => {
        return <tr key={'mrkey-' + r.id}>
            <td>{r.client.fullName}</td>
            <td>{r.onboardDate.toDateString()}</td>
            <td>{r.onboardUser.getFullName()}</td>
            <td>
                <button type={'button'} className='btn btn-danger'
                        onClick={() => this.toggleCloseModal(true, r.client.id)}>Remove
                    Client
                </button>
            </td>
        </tr>
    }

    render(): React.ReactNode {
        return <FileContainer>
            <Title name={'Mail'}>
                <button type='button' className='btn btn-success' onClick={() => this.toggleAddModal(true)}>Add Mail
                    Record
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
                    <label htmlFor='end_date' className='col-sm-2'>Final Mail Date</label>
                    <div className={'col-sm-10'}>
                        <input type='date' className='form-control' id='end_date'
                               placeholder='End Date'
                               value={this.state.endDate}
                               onChange={this.setEndDate}
                               autoComplete="off"
                        />
                    </div>
                </div>

            </FormModal>
            <FormModal
                title='Add Mail Record'
                show={this.state.showAddModal}
                close={() => this.toggleAddModal(false)}
                submitButton={true}
                onSubmit={this.submitForm}
            >
                <div className='form-group row'>
                    <label htmlFor='client' className='col-sm-2'>Client</label>
                    <div className='col-sm-10'>
                        {
                            (
                                () => {

                                    if (this.state.mailClientBuilder.client === undefined) {
                                        return <ClientSelect
                                            id='client'
                                            clients={this.state.availableClients}
                                            action={this.setClient}
                                        />
                                    } else {

                                        return <div className='input-group'>
                                            <input className='form-control disabled' disabled={true}
                                                   value={this.state.mailClientBuilder.client.fullName}
                                            />
                                            <div className='input-group-append'>
                                                <div className='input-group-text pointer' onClick={
                                                    () => {
                                                        this.setClient(undefined);
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
                <div className='form-group row'>
                    <label htmlFor='start_date' className='col-sm-2'>Start Date</label>
                    <div className={'col-sm-10'}>
                        <input type='date' className='form-control' id='start_date'
                               placeholder='Start Date'
                               value={this.state.mailClientBuilder.date === undefined ? '' : BDate.fromDate(this.state.mailClientBuilder.date).jsDate}
                               onChange={(e) => this.setDate(new Date(e.target.value))}
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

                                    if (this.state.mailClientBuilder.user === undefined) {
                                        return <UserSelect
                                            id='user'
                                            users={this.state.users}
                                            action={this.setUser}
                                        />
                                    } else {

                                        return <div className='input-group'>
                                            <input className='form-control disabled' disabled={true}
                                                   value={this.state.mailClientBuilder.user.getFullName()}
                                            />
                                            <div className='input-group-append'>
                                                <div className='input-group-text pointer' onClick={
                                                    () => {
                                                        this.setUser(undefined);
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
            <Loader loading={this.state.loading && false} emptyText={''} isEmpty={false}>
                <table className='table table-hover'>
                    <thead className='thead-dark'>
                    <tr>
                        <th>Client</th>
                        <th>Start Date</th>
                        <th>Onboard Employee</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.mailClients.map(this.renderRow)}
                    </tbody>
                </table>
            </Loader>
        </FileContainer>
    }
}


export default connector(AllMail)