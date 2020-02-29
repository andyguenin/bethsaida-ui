import {BaseState, initialBaseState} from "./BaseReducer";
import {ClientState, initialClientState} from "./ClientReducer";
import {EventState} from "./EventReducer";
import {ServiceState} from "./ServiceReducer";

export interface AppState {
    base: BaseState
    clientState: ClientState
    eventState: EventState
    serviceState: ServiceState
}
