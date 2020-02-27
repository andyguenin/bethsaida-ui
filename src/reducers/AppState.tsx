import {BaseState, initialBaseState} from "./BaseReducer";
import {ClientState, initialClientState} from "./ClientReducer";

export interface AppState {
    base: BaseState
    clientState: ClientState
}
