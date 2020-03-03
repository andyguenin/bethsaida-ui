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

const mapStateToProps = (state: AppState) => ({
    eventState: state.eventState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        getSingleEvent: (id: string, action: (c: BethsaidaEvent) => void) => dispatch(GetSingleEvent(id, action)),
        getSingleService: (id: string, action: (s: Service) => void) => dispatch(GetSingleService(id, action))
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
                this.setState(Object.assign({}, this.state, {
                    event: event
                }))
                this.props.getSingleService(event.serviceId, (service: Service) => {
                    this.setState(Object.assign({}, this.state, {
                            service: service,
                            loading: false
                        }
                    ))
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
                    <Fragment>
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
                            </div>
                        </div>
                    </Fragment>
                </Loader>
            </FileContainer>
        )
    }
}

export default withRouter(connector(ShowEvent))