import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import FileContainer from "../../components/app/FileContainer";
import {Title} from "../../components/app/Title";
import {Loader} from "../../components/app/loader/Loader";
import {LoadAllEvents} from "../../services/Event";
import BethsaidaEvent from "../../data/BethsaidaEvent";
import Service from "../../data/Service";
import {LoadAllServices} from "../../services/Service";
import {LoadAllUsers} from "../../services/User";
import User from "../../data/User";


const mapStateToProps = (state: AppState) => ({
    eventState: state.attendanceState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        loadAllEvents: (updateFunc: (events: BethsaidaEvent[]) => void, archive: boolean) => dispatch(LoadAllEvents(updateFunc, archive)),
        loadAllServices: (updateFunc: (services: Service[]) => void) => dispatch(LoadAllServices(updateFunc)),
        loadAllUsers: (updateFunc: (users: User[]) => void) => dispatch(LoadAllUsers(updateFunc))
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
)

type PropsFromRedux = ConnectedProps<typeof connector>

// if we want to add in other props required for the tag that aren't part of the state
type Props = PropsFromRedux & {
    archive?: boolean,
    missingDataMessage: string
}

interface ServiceMapping {
    [id: string]: Service
}

interface State {
    gridEvent: BethsaidaEvent[],
    services: Map<string, Service>,
    loading: boolean,
    users: Map<string, User>
}

class AllAttendance extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            gridEvent: [],
            services: new Map<string, Service>(),
            loading: true,
            users: new Map<string, User>()
        }


    }

    componentDidMount(): void {
        this.props.loadAllEvents((s) => {
            this.setState(
                Object.assign({},
                    this.state,
                    {
                        gridEvent: s,
                        loading: false
                    }
                )
            )
        }, this.props.archive || false);

        this.props.loadAllServices((s) => {
            const serviceMap = s.reduce((p: Map<string, Service>, sr: Service) => {
                return p.set(sr.id, sr);
            }, new Map<string, Service>());
            this.setState(
                Object.assign(
                    {},
                    this.state,
                    {
                        services: serviceMap
                    }
                )
            )
        })

        this.props.loadAllUsers((s) => {
            const userMap = s.reduce((p: Map<string, User>, us: User) => {
                return p.set(us.id || '', us);
            }, new Map<string, User>());
            this.setState(
                Object.assign(
                    {},
                    this.state,
                    {
                        users: userMap
                    }
                )
            )
        })

    }

    public render() {
        return (
            <FileContainer>
                <Title name='Attendance Management'>
                    <button type='button' className='btn btn-success form-control'
                            onClick={() => window.location.href = '/attendance/new'}>New Attendance Sheet
                    </button>
                    <button
                        className='btn btn-info form-control'
                        type='button'
                        onClick={() => window.location.href = '/attendance/archive'}
                    >
                        Attendance Sheet Archive
                    </button>
                </Title>
                <Loader
                    loading={this.state.loading}
                    isEmpty={this.state.gridEvent.length === 0}
                    emptyText={this.props.missingDataMessage}
                >

                    <table className='table table-bordered table-hover'>
                        <thead className='thead-dark'>
                        <tr>
                            <th>Service Type</th>
                            <th>Date</th>
                            <th>Capacity</th>
                            <th>Event Creator</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.gridEvent.map((s) => {
                            return (
                                <tr key={s.id} className='clickable-row' onClick={() => {
                                    window.location.href = '/attendance/' + s.id;
                                }}>
                                    <td className='align-content-center'>{
                                        (() => {
                                                const service = this.state.services.get(s.serviceId);
                                                if (service !== undefined) {
                                                    return service.name
                                                } else {
                                                    return <i>UNKNOWN</i>
                                                }
                                            }
                                        )()
                                    }</td>
                                    <td className='align-content-center'>{s.date ? s.date.mmddyyyy : ''}</td>
                                    <td className='align-content-center'>{s.capacity === 0 ? '-' : s.capacity}</td>
                                    <td className='align-content-center'>{
                                        (() => {
                                            if (s.userCreatorId) {
                                                const user = this.state.users.get(s.userCreatorId);
                                                if (user !== undefined) {
                                                    return user.name
                                                }
                                            }
                                            return <i>UNKNOWN</i>
                                        })()
                                    }</td>
                                </tr>)
                        })}
                        </tbody>
                    </table>

                </Loader>
            </FileContainer>
        );
    }
}


export default connector(AllAttendance)