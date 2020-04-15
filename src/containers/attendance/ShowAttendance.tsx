import React, {ChangeEvent, Fragment} from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {withRouter, RouteChildrenProps} from 'react-router-dom'
import FileContainer from "../../components/app/FileContainer";
import {Title} from "../../components/app/Title";
import {Loader} from "../../components/app/loader/Loader";
import BethsaidaEvent from "../../data/BethsaidaEvent";
import Service from "../../data/Service";
import {GetSingleService} from "../../services/Service";
import User from "../../data/User";
import {GetSingleUser, LoadAllUsers} from "../../services/User";
import Notes from "../../components/Notes";
import {GetAllClients, GetSingleClientBan} from "../../services/Client";
import Client from "../../data/Client";
import AttendanceModal from "../../components/attendance/AttendanceModal";
import {createAttendanceRecord, getAttendanceRecords, removeAttendance} from "../../services/Attendance";
import Attendance from "../../data/Attendance";
import {GetNote, SetNote} from "../../services/Note";
import {GetSingleEvent} from "../../services/Event";
import TextModal from "../../components/app/TextModal";
import Ban from "../../data/Ban";
import ElemModal from "../../components/app/ElemModal";

const mapStateToProps = (state: AppState) => ({
    clientState: state.clientState,
    eventState: state.attendanceState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        getSingleEvent: (id: string, action: (c: BethsaidaEvent) => void) => dispatch(GetSingleEvent(id, action)),
        getSingleService: (id: string, action: (s: Service) => void) => dispatch(GetSingleService(id, action)),
        loadAllClients: () => dispatch(GetAllClients(() => undefined)),
        getSingleUser: (id: string, action: (u: User) => void) => dispatch(GetSingleUser(id, action)),
        addAttendance: (client: Client, event: BethsaidaEvent, action: (att: Attendance) => void) => dispatch(createAttendanceRecord(client, event, action)),
        getAllAttendance: (event: BethsaidaEvent, success: (attendances: Attendance[]) => void) => dispatch(getAttendanceRecords(event, success)),
        removeAttendance: (id: string, action: (id: string) => void) => dispatch(removeAttendance(id, action)),
        setNote: (id: string, note: string, action: (text: string) => void) => dispatch(SetNote(id, note, action)),
        getNote: (id: string, action: (text: string) => void) => dispatch(GetNote(id, action)),
        getSingleClientBan: (id: string, action: (ban?: Ban) => void) => dispatch(GetSingleClientBan(id, action))
    };
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

interface RouteProps {
    id: string
}

interface AttendanceEnhanced {
    attendance: Attendance,
    client: Client
}

interface IState {
    loading: boolean
    event?: BethsaidaEvent
    service?: Service
    user?: User,
    attendanceLoading: boolean,
    attendanceInfo: AttendanceEnhanced[],
    showModal: boolean,
    note: string,
    errorModalClient?: Client,
    errorModalMessage?: JSX.Element
}

type Props = PropsFromRedux & RouteChildrenProps<RouteProps>

class ShowAttendance extends React.Component<Props, IState> {

    private summaryNumber = 5;

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: true,
            attendanceLoading: false,
            attendanceInfo: [],
            showModal: false,
            note: ''
        }
    }

    buildAttendanceEnhanced = (attendance: Attendance[]): AttendanceEnhanced[] => {
        const ae: AttendanceEnhanced[] = attendance.flatMap((a) => {
            const client = this.props.clientState.clients.find((c) => c.id === a.clientId);
            if (client !== undefined) {
                return [{
                    attendance: a,
                    client: client
                }]
            } else {
                return []
            }
        });
        return this.state.attendanceInfo.concat(ae);
    }

    componentDidMount(): void {
        this.props.loadAllClients();
        if (this.props.match?.params) {
            const id = this.props.match?.params.id || '';
            this.props.getSingleEvent(id, (event: BethsaidaEvent) => {
                this.props.getSingleService(event.serviceId, (service: Service) => {
                    this.props.getSingleUser(event.userCreatorId || '', (user: User) => {
                        this.props.getAllAttendance(event, (attendances: Attendance[]) => {
                            this.props.getNote(id || '', (note) => {
                                this.setState(Object.assign({},
                                    this.state,
                                    {
                                        event: event,
                                        service: service,
                                        user: user,
                                        loading: false,
                                        attendanceInfo: this.buildAttendanceEnhanced(attendances),
                                        note: note
                                    }
                                ))
                            })
                        })
                    })
                })
            })
        }
    }

    private getBanModalText(client: Client, text: string) {
        return (
            <div>
                <h1>{client.fullName} is banned from Downtown Daily Bread</h1>
                <p>
                    Please do not let them use any services or resources.
                </p>
                <p>
                    <div dangerouslySetInnerHTML={{__html: text || ''}}/>
                </p>
            </div>

        )

    }

    private clientSelect = (c: Client): void => {
        this.showModal(false, () => {
            if (c.isBanned) {
                const setModalClient = (errorModalMessage?: JSX.Element) => this.setState(Object.assign({}, this.state, {errorModalClient: c, errorModalMessage}))
                if(c.id) {
                    this.props.getSingleClientBan(c.id, (ban) =>{
                        if(ban !== undefined) {
                            setModalClient(this.getBanModalText(c, ban.notes || ''))
                        } else {
                            setModalClient(undefined)
                        }
                    })
                } else {
                    setModalClient(undefined)
                }
            } else {
                if (this.state.event !== undefined) {
                    this.props.addAttendance(c, this.state.event, (attendance) => {
                        this.setState(Object.assign({},
                            this.state,
                            {
                                attendanceInfo: this.buildAttendanceEnhanced([attendance])
                            }))
                    })
                }
            }
        })
    };


    private showModal = (showModal: boolean, next: () => void = () => undefined): void => {
        this.setState(
            Object.assign({}, this.state, {showModal}), next
        )
    }

    private renderSingleAttendance = (ae: AttendanceEnhanced) => {
        return (
            <tr className='pointer' key={ae.client.id} onClick={() => {
                window.location.href = '/client/' + ae.client.id
            }}>
                <td>{ae.client.fullName}</td>
                <td>
                    {ae.attendance.checkinTime.toLocaleString()}
                </td>
                <td>
                    <div className='pointer' onClick={(e) => {
                        e.stopPropagation();
                        const confirm = window.confirm("Are you sure you want to remove the attendance record of " + ae.client.fullName + "?");
                        if (confirm) {
                            this.props.removeAttendance(ae.attendance.id, (id: string) => {
                                return this.setState(Object.assign({}, this.state, {
                                    attendanceInfo: this.state.attendanceInfo.filter((a) => a.attendance.id !== id)
                                }))
                            })
                        }
                    }}>&times;</div>
                </td>
            </tr>
        )
    }

    private renderAttendance = () => {
        return this.state.attendanceInfo.sort((a, b) => {
            return b.attendance.checkinTime.valueOf() - a.attendance.checkinTime.valueOf()
        }).map(this.renderSingleAttendance)
    }


    render() {
        return (
            <FileContainer>
                <Loader
                    loading={this.state.loading}
                    emptyText='No attendance sheet found.'
                    isEmpty={this.state.event === undefined}
                >
                    <Title name={this.state.service?.name + ' - ' + this.state.event?.date.mmddyyyy}>
                        <button
                            className='btn btn-success form-control'
                            type='button'
                            onClick={() => window.location.href = '/attendance/' + (this.state.event?.id || '') + '/edit'}>
                            Edit
                        </button>
                    </Title>
                    <AttendanceModal
                        clients={this.props.clientState.clients.filter((c) => {
                            return !this.state.attendanceInfo.map((a) => a.client).includes(c)
                        })}
                        summaryCount={5}
                        sortFunction={this.props.clientState.clientSortFunction}
                        filterFunction={this.props.clientState.clientFilterFunction}
                        selectFunction={this.clientSelect}
                        closeModal={() => this.showModal(false)}
                        show={this.state.showModal}
                    />
                    <ElemModal title='Ban Notes' show={this.state.errorModalClient !== undefined} close={() => this.setState(Object.assign({}, this.state, {errorModalClient: undefined}))}>
                        {this.state.errorModalMessage}
                    </ElemModal>
                    <div className='row'>
                        <div className='col-md-3'>
                            <table className='table table-bordered table-hover'>
                                <thead className='thead-dark'>
                                <tr>
                                    <th></th>
                                    <th>Event Attributes</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Event Creator</td>
                                    <td>{(this.state.user !== undefined)
                                        ? this.state.user.name : '-'}</td>
                                </tr>
                                <tr>
                                    <td>Capacity</td>
                                    <td>{this.state.event?.capacity === 0 ? '-' : this.state.event?.capacity}</td>
                                </tr>
                                <tr>
                                    <td>Current Attendance</td>
                                    <td>{this.state.attendanceInfo.length}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='col-md-4'>
                            <div className='row buttonid'>
                                <button className='btn btn-success' onClick={() => this.showModal(true)}>+ Sign in
                                    client
                                </button>
                            </div>
                            <Loader loading={this.state.attendanceLoading}
                                    emptyText={'No clients on attendance sheet yet.'}
                                    isEmpty={this.state.attendanceInfo.length === 0}>
                                <table className='table table-bordered table-hover'>
                                    <thead className='thead-dark'>
                                    <tr>
                                        <th>Attendance Sheet</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.renderAttendance()}
                                    </tbody>
                                </table>
                            </Loader>
                        </div>
                        <Notes
                            onUpdate={(d, e) => this.props.setNote((this.state.event as BethsaidaEvent).id || '', d, (note) => {
                                e(note)
                            })}
                            notes={this.state.note}/>
                    </div>
                </Loader>
            </FileContainer>
        )
    }
}

export default withRouter(connector(ShowAttendance))
