import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import AllAttendance from "./AllAttendance";



const mapStateToProps = (state: AppState) => ({
    attendanceState: state.attendanceState,
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

class ActiveAttendance extends React.Component<Props> {

  render() {
      return <AllAttendance
          archive={false}
          missingDataMessage='There are no active attendance sheets.'
      />
  }
}


export default connector(ActiveAttendance)