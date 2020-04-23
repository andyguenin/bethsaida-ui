import React from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import {withRouter, RouteChildrenProps} from 'react-router-dom'
import {Loader} from "../../components/app/loader/Loader";
import FileContainer from "../../components/app/FileContainer";
import ErrorMessage from "../../components/app/ErrorMessage";
import {GetSingleEvent, UpdateEvent} from "../../services/Event";
import BethsaidaEventBuilder from "../../data/BethsaidaEventBuilder";
import BethsaidaEvent from "../../data/BethsaidaEvent";
import ModifyAttendance from "../../components/attendance/ModifyAttendance";


const mapStateToProps = (state: AppState) => ({
    event: state.attendanceState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        loadEvent: (id: string, action: (event: BethsaidaEvent) => void) => dispatch(GetSingleEvent(id, action)),
        updateEvent: (event: BethsaidaEventBuilder, action: (id: string) => void, failure: (message: string) => void): boolean => {
            dispatch(UpdateEvent(
                event,
                action
            ))
            return true
        }
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

interface IRoute {
    id: string
}

interface State {
    loadedEvent?: BethsaidaEvent,
    loading: boolean,
    errorMessage?: string
}

type Props = PropsFromRedux & RouteChildrenProps<IRoute> & {}

class EditAttendance extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            loadedEvent: undefined,
            loading: true
        }

    }

    private setErrorMessage = (message: string): void => {
        this.setState(
            Object.assign({},
                this.state,
                {
                    errorMessage: message
                }
            )
        )
    }

    componentDidMount(): void {
        if (this.props.match?.params) {
            this.props.loadEvent(this.props.match?.params.id, (s) => {
                this.setState(
                    Object.assign(
                        {},
                        this.state,
                        {
                            loadedEvent: s,
                            loading: false
                        }
                    )
                )
            })
        }
    }

    public render() {
        return (
            <FileContainer>
                <Title name={'Edit Attendance Sheet'}/>
                <Loader
                    loading={this.state.loading}
                    isEmpty={this.state.loadedEvent === undefined}
                    emptyText='No attendance sheet found.'
                >
                    <ErrorMessage errorMessage={this.state.errorMessage}/>
                    <ModifyAttendance
                        attendance={BethsaidaEventBuilder.load(this.state.loadedEvent)}
                        submitText='Edit Attendance Sheet'
                        submitAction={(cb) => this.props.updateEvent(cb, (id) => {
                            window.location.href = '/shelter/' + id;
                        }, this.setErrorMessage)}
                        cancelAction={() => window.location.href = '/shelter/' + this.props.match?.params.id}
                    />
                </Loader>
            </FileContainer>
        )
    }
}

export default withRouter(connector(EditAttendance))