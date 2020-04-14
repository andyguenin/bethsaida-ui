import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import AllEvents from "./AllAttendance";



const mapStateToProps = (state: AppState) => ({
    eventState: state.attendanceState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {}
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

class AttendanceArchive extends React.Component<Props> {

    render() {
        return <AllEvents
            archive={true}
            missingDataMessage='No attendance sheets have been created.'
        />
    }
}


export default connector(AttendanceArchive)