import React, {Fragment} from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {withRouter, RouteChildrenProps} from 'react-router-dom'
import FileContainer from "../../components/app/FileContainer";
import {Title} from "../../components/app/Title";
import {Loader} from "../../components/app/loader/Loader";
import {GetSingleEvent} from "../../services/Event";
import BethsaidaEvent from "../../data/BethsaidaEvent";
import Service from "../../data/Service";
import {GetSingleService} from "../../services/Service";
import User from "../../data/User";
import {GetSingleUser} from "../../services/User";
import Notes from "../../components/Notes";

const mapStateToProps = (state: AppState) => ({
    eventState: state.eventState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        getSingleEvent: (id: string, action: (c: BethsaidaEvent) => void) => dispatch(GetSingleEvent(id, action)),
        getSingleService: (id: string, action: (s: Service) => void) => dispatch(GetSingleService(id, action)),
        getSingleUser: (id: string, action: (u: User) => void) => dispatch(GetSingleUser(id, action))
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

interface IState {
    loading: boolean
    event?: BethsaidaEvent
    service?: Service
    user?: User
}

type Props = PropsFromRedux & RouteChildrenProps<RouteProps>

class ShowEvent extends React.Component<Props, IState> {

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: true
        }

    }

    componentDidMount(): void {
        if (this.props.match?.params) {
            this.props.getSingleEvent(this.props.match?.params.id, (event: BethsaidaEvent) => {
                this.props.getSingleService(event.serviceId, (service: Service) => {
                    this.props.getSingleUser(event.userCreatorId || '', (user: User) => {
                        this.setState(Object.assign({},
                            this.state,
                            {
                                event: event,
                                service: service,
                                user: user,
                                loading: false
                            }
                        ))
                    })
                })
            })
        }
    }

    render() {
        return (
            <FileContainer>
                <Loader
                    loading={this.state.loading}
                    emptyText='No event found.'
                    isEmpty={this.state.event === undefined}
                >
                    <Title name={this.state.service?.name + ' - ' + this.state.event?.date.mmddyyyy}>
                        <button
                            className='btn btn-success form-control'
                            type='button'
                            onClick={() => window.location.href = '/event/' + (this.state.event?.id || '') + '/edit'}>
                            Edit
                        </button>
                    </Title>
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
                                    <td>{this.state.event?.capacity}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='col-md-4'>
                            <div className='row buttonid'>
                                <button className='btn btn-success'>+ Sign in client</button>
                            </div>
                            <table className='table table-bordered table-hover'>
                                <thead className='thead-dark'>
                                <tr>
                                    <th>Attendance Sheet</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Attendance</td>
                                    <td></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <Notes />
                    </div>
                </Loader>
            </FileContainer>
        )
    }
}

export default withRouter(connector(ShowEvent))