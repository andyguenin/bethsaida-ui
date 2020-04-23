import React from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import FileContainer from "../../components/app/FileContainer";
import ModifyAttendance from "../../components/attendance/ModifyAttendance";
import BethsaidaEventBuilder from "../../data/BethsaidaEventBuilder";
import {NewEventRequest} from "../../services/Event";


const mapStateToProps = (state: AppState) => ({
    event: state.attendanceState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        newEvent: (builder: BethsaidaEventBuilder) => dispatch(NewEventRequest(builder, (id) => {
            window.location.href='/shelter/'+id;
        }))
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux

class NewAttendance extends React.Component<Props> {

    render() {
        return (
            <FileContainer>
                <Title name="New Attendance Sheet" />
                <ModifyAttendance
                    attendance={BethsaidaEventBuilder.emptyBuilder()}
                    cancelAction={() => window.location.href='/shelter'}
                    submitAction={(c: BethsaidaEventBuilder) => {this.props.newEvent(c); return true;}}
                    submitText='Create Attendance Sheet'
                />
            </FileContainer>
        )
    }
}

export default connector(NewAttendance)