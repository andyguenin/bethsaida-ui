import React, {FormEvent, Fragment} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import FileContainer from "../../components/app/FileContainer";
import {Title} from "../../components/app/Title";
import BDate from "../../data/BDate";
import BethsaidaEvent from "../../data/BethsaidaEvent";
import {GetAllEvents, NewEvent} from "../../services/Event";
import {ServiceType} from "../../data/ServiceType";
import FormModal from "../../components/app/FormModal";
import Client from "../../data/Client";
import Attendance from "../../data/Attendance";
import {GetAllClients} from "../../services/Client";
import User from "../../data/User";
import {GetAllUsers} from "../../services/User";
import {CreateAttendanceRecord, GetAttendanceRecords, removeAttendance} from "../../services/Attendance";
import {Loader} from "../../components/app/loader/Loader";
import ClientSelect from "../../components/app/ClientSelect";
import BethsaidaEventBuilder from "../../data/BethsaidaEventBuilder";
import Service from "../../data/Service";
import {GetAllServices} from "../../services/Service";
import UserSelect from "../../components/app/UserSelect";
import Credentials from "../../data/Credentials";
import {clientCompareFunction, clientSortFunc} from "../../util/ClientUtil";


const mapStateToProps = (state: AppState) => ({
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        getAllUsers: (action: (users: User[]) => void) => dispatch(GetAllUsers(action)),
        getAllClients: (action: (client: Client[]) => void, users: User[]) => dispatch(GetAllClients(action, users)),
        getAllServices: (action: (service: Service[]) => void) => dispatch(GetAllServices(action)),
        getAllEvents: (action: (event: BethsaidaEvent[]) => void) => dispatch(GetAllEvents(action, true, ServiceType.SHOWER)),
        getAllAttendance: (event: BethsaidaEvent, action: (attendance: Attendance[]) => void) => dispatch(GetAttendanceRecords(event, action)),
        newEvent: (event: BethsaidaEventBuilder, action: (id: string) => void) => dispatch(NewEvent(event, action)),
        removeAttendance: (attendance: Attendance, action: (id: string) => void) => dispatch(removeAttendance(attendance.id || '', action)),
        createAttendanceRecord: (client: Client, event: BethsaidaEvent, user: User, action: (att: Attendance) => void) =>
            dispatch(CreateAttendanceRecord(client, event, user, action))
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}

interface AttendanceBuilder {
    client?: Client,
    date?: string,
    user?: User
}

interface EnhancedAttendance{
    attendance: Attendance,
    client: Client
}

interface State {
    hideall: boolean
    loading: boolean
    intermediateDate: string
    date: string
    users: User[]
    events: BethsaidaEvent[]
    clients: Client[]
    service?: Service
    addClientModalVisible: boolean
    attendance: Attendance[],
    attendanceBuilder: AttendanceBuilder
    currentUser?: User
    clientsToShow: Client[]
}

class AllShowers extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        const date = BDate.fromDate(new Date()).jsDate
        this.state = {
            loading: true,
            intermediateDate: date,
            date,
            events: [],
            clients: [],
            addClientModalVisible: false,
            attendance: [],
            users: [],
            attendanceBuilder: {},
            clientsToShow: [],
            hideall: true
        }
    }

    private toggleAddClientModal = (show: boolean) => {
        this.setState((state, props) => Object.assign({}, state, {
            addClientModalVisible: show,
            attendanceBuilder: {
                date: state.date,
                user: this.state.currentUser
            }
        }))
    }

    componentDidMount(): void {
        this.props.getAllUsers((users) => {
            const currentUser = users.find(u => u.id === new Credentials().getId())
                this.props.getAllClients((clients) => {
                    this.props.getAllServices((services) => {
                        const service = services.find(s => s.serviceType === ServiceType.SHOWER)
                        this.setState((state, props) => Object.assign({}, state, {
                            users,
                            clients,
                            service,
                            currentUser
                        }), this.loadAttendance)
                    })
                }, users)
            }
        )
    }

    private getService = (): Service => {
        if (this.state.service === undefined) {
            throw Error('Cannot fetch service')
        } else {
            return this.state.service
        }
    }

    private loadAttendance = (andThen: () => void = () => undefined) => {
        this.props.getAllEvents((events) => {
            this.setState((state, props) => Object.assign({}, state, {loading: true, events}),
                () => {
                    this.setState((state, props) => {
                        const currentEvent = state.events.find((e) =>
                            (JSON.stringify(e.date) === JSON.stringify(BDate.fromjsDate(this.state.date)))
                        )
                        if (currentEvent === undefined) {
                            return Object.assign({}, state, {loading: false, attendance: [], clientsToShow: state.clients})
                        } else {
                            this.props.getAllAttendance(currentEvent, (attendance) => {
                                this.setAttendanceRecords(attendance)
                            })
                            return state;
                        }
                    }, andThen)
                })
        })
    }

    private renderRow = (attendance: Attendance) => {
        const client = this.state.clients.find(c => c.id === attendance.clientId)
        const user = this.state.users.find(u => u.id === attendance.userId)
        if (client === undefined || user === undefined) {
            return <Fragment/>
        } else {
            return (
                <tr key={'clientid-' + client.id}>
                    <td>{client.fullName}</td>
                    <td>{user.getFullName()}</td>
                    <td>
                        <button type={'button'} className='btn btn-danger'
                                onClick={() => this.removeAttendance(attendance)}>Remove Client
                        </button>
                    </td>
                </tr>
            )
        }
    }

    private sortAttendance = (attendances: Attendance[]): Attendance[] => {
        const ae: EnhancedAttendance[] = attendances.map(at => {
            const client = this.state.clients.find(c => c.id === at.clientId)
            if(client === undefined) {
                throw new Error('Could not find matching intake user')
            } else {
                return {
                    client, attendance: at
                }
            }
        })

        return ae.sort((a, b) => clientCompareFunction(a.client, b.client)).map(r => r.attendance)
    }

    private setAttendanceRecords = (attendances: Attendance[]) => {
        const attendance = this.sortAttendance(attendances)


        this.setState((state, props) => {
            const clientsToShow = state.clients.filter(c => attendances.find(a => a.clientId === c.id) === undefined)

            return Object.assign({}, state, {
                loading: false,
                addClientModalVisible: false,
                attendance,
                clientsToShow
            })
        })
    }

    private addShowerClient = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (this.state.attendanceBuilder.client !== undefined && this.state.attendanceBuilder.user !== undefined) {
            const client = this.state.attendanceBuilder.client;
            const user = this.state.attendanceBuilder.user;
            let event = this.state.events.find(e => JSON.stringify(e.date) === JSON.stringify(BDate.fromjsDate(this.state.attendanceBuilder.date)))
            if (event === undefined) {
                this.props.newEvent(
                    new BethsaidaEventBuilder()
                        .setDate(this.state.attendanceBuilder.date || '')
                        .setServiceId(this.getService().id)
                        .setCapacity('0')
                        .setId('')
                    ,
                    (id: string) => {
                        this.loadAttendance(() => {
                            this.addShowerClient(e)
                        })
                    })
            } else {
                this.props.createAttendanceRecord(client, event, user, (att) => this.setAttendanceRecords(this.state.attendance.concat([att])))
            }
        }
    }

    private removeAttendance = (attendance: Attendance) => {
        const al: boolean = window.confirm('Are you sure you want to remove this client?')
        if (al) {
            this.props.removeAttendance(attendance, (id: string) => {
                this.loadAttendance()
            })
        }
    }

    public render() {
        return (
            <FileContainer>
                <Title name='Showers'>
                    <button type={'button'} className='btn btn-success' onClick={() => this.toggleAddClientModal(true)}>
                        Check in Client
                    </button>
                    &nbsp;
                    <input type='date' className='form-control' id='date'
                           value={this.state.intermediateDate}
                           onChange={(e) => {
                               const intermediateDate = e.target.value
                               this.setState((state, props) => Object.assign({}, state, {
                                   intermediateDate,
                                   date: intermediateDate
                               }), this.loadAttendance)
                           }}
                    />


                </Title>
                <FormModal
                    title={'Check in a client'}
                    show={this.state.addClientModalVisible}
                    close={() => this.toggleAddClientModal(false)}
                    submitButton={true}
                    onSubmit={this.addShowerClient}
                >
                    <div className='form-group row'>
                        <label htmlFor='client_name' className='col-sm-2'>Client Name</label>
                        <div className={'col-sm-10'}>
                            <ClientSelect
                                id='client_name'
                                clients={this.state.clientsToShow}
                                action={(client) => this.setState((state, props) => {
                                    return Object.assign({}, state, {
                                        attendanceBuilder: Object.assign({}, state.attendanceBuilder, {client})
                                    })
                                })}
                                selectedClient={this.state.attendanceBuilder?.client}
                            />
                        </div>
                    </div>
                    <div className='form-group row'>
                        <label htmlFor='shower_date' className='col-sm-2'>Shower Date</label>
                        <div className={'col-sm-10'}>
                            <input type='date' className='form-control' id='shower_date' disabled={true}
                                   placeholder='Shower Date'
                                   value={this.state.attendanceBuilder?.date}
                                   onChange={(e) => {
                                       const date = e.target.value;
                                       this.setState((state, props) =>
                                           Object.assign({}, state, {
                                               attendanceBuilder: Object.assign({}, state.attendanceBuilder, {
                                                   date
                                               })
                                           })
                                       )
                                   }}
                                   autoComplete="off"
                            />
                        </div>
                    </div>
                    <div className='form-group row'>
                        <label htmlFor='employee' className='col-sm-2'>Intake Employee</label>
                        <div className={'col-sm-10'}>
                            <UserSelect
                                id='employee'
                                users={this.state.users}
                                action={(user) => this.setState((state, props) => {
                                    return Object.assign({}, state, {
                                        attendanceBuilder: Object.assign({}, state.attendanceBuilder, {user})
                                    })
                                })}
                                selectedUser={this.state.attendanceBuilder?.user}
                            />
                        </div>
                    </div>

                </FormModal>
                <Loader loading={this.state.loading} emptyText={'No clients have showered on this day.'}
                        isEmpty={this.state.attendance.length === 0}>
                    <table className='table table-hover'>
                        <thead className='thead-dark'>
                        <tr>
                            <th>Client</th>
                            <th>Check-in Employee</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.attendance.map(this.renderRow)}
                        </tbody>
                    </table>
                </Loader>
            </FileContainer>
        )
    }
}


export default connector(AllShowers)
