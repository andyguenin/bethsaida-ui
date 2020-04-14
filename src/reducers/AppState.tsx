import {BaseState, initialBaseState} from "./BaseReducer";
import {ClientState, initialClientState} from "./ClientReducer";
import {AttendanceState} from "./EventReducer";
import {ServiceState} from "./ServiceReducer";

export interface AppState {
    base: BaseState
    clientState: ClientState
    attendanceState: AttendanceState
    serviceState: ServiceState
}
