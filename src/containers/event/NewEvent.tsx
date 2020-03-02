import React from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import FileContainer from "../../components/app/FileContainer";
import ModifyEvent from "../../components/event/ModifyEvent";
import BethsaidaEventBuilder from "../../data/BethsaidaEventBuilder";
import {NewEventRequest} from "../../services/Event";


const mapStateToProps = (state: AppState) => ({
    event: state.eventState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        newEvent: (builder: BethsaidaEventBuilder) => dispatch(NewEventRequest(builder, (id) => {
            window.location.href='/event/'+id;
        }))
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux

class NewEvent extends React.Component<Props> {

    render() {
        return (
            <FileContainer>
                <Title name="New Event" />
                <ModifyEvent
                    event={BethsaidaEventBuilder.emptyBuilder()}
                    cancelAction={() => window.location.href='/event'}
                    submitAction={(c: BethsaidaEventBuilder) => {this.props.newEvent(c); return true;}}
                    submitText='Create Event'
                />
            </FileContainer>
        )
    }
}

export default connector(NewEvent)