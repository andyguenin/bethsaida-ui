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

const mapStateToProps = (state: AppState) => ({
    eventState: state.eventState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        getSingleEvent: (id: string, action: (c: BethsaidaEvent) => void) => dispatch(GetSingleEvent(id, action))
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
}

type Props = PropsFromRedux & RouteChildrenProps<RouteProps>

class ShowEvent extends React.Component<Props, IState> {

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: true,
            event: undefined
        }

    }

    componentDidMount(): void {
        if (this.props.match?.params) {
            this.props.getSingleEvent(this.props.match?.params.id, (event: BethsaidaEvent) => {
                this.setState({
                    event: event,
                    loading: false
                })

            })
        }
    }

    render() {
        return (
            <FileContainer>
                <Loader loading={this.state.loading}>
                    {
                        (() => {
                            if (this.state.event !== undefined) {
                                return (
                                    <Fragment>
                                    <Title name={this.state.event?.id}>
                                        <button
                                            className='btn btn-success form-control'
                                            type='button'
                                            onClick={() => window.location.href='/event/' + (this.state.event?.id || '') + '/edit'}>
                                            Edit</button>
                                    </Title>
                                        <div className='row'>
                                            <div className='col-md-3'>
                                            </div>
                                        </div>
                                    </Fragment>

                                )
                            } else {
                                return (<div></div>);
                            }
                        })()
                    }
                </Loader>
            </FileContainer>
        )
    }
}

export default withRouter(connector(ShowEvent))