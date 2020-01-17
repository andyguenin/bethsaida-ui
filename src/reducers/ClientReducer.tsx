import Client from "../data/Client";
import {
    CLIENT_SET_TEMP_CLIENT,
    CLIENT_SET_WORKING_CLIENT,
    CLIENT_SETDATA,
    CLIENT_UNSET_TEMP_CLIENT,
    CLIENT_UNSET_WORKING_CLIENT,
    ClientAction
} from "../actions/Client";


export interface ClientState {
    loading: boolean,
    clients: Client[],
    temporaryClient?: Client
    workingClient?: Client
}

export const initialClientState: ClientState = {
    loading: false,
    clients: [],
    temporaryClient: undefined,
    workingClient: undefined
}

export function clientReducer(state: ClientState = initialClientState, action: ClientAction) {
    switch(action.type) {
        case CLIENT_SETDATA:
            return Object.assign({}, state, {clients: action.data});
        case CLIENT_SET_TEMP_CLIENT:
            return Object.assign({}, state, {temporaryClient: action.client});
        case CLIENT_UNSET_TEMP_CLIENT:
            return Object.assign({}, state, {temporaryClient: undefined});
        case CLIENT_SET_WORKING_CLIENT:
            return Object.assign({}, state, {workingClient: action.client});
        case CLIENT_UNSET_WORKING_CLIENT:
            return Object.assign({}, state, {workingClient: undefined});
        default:
            return state;
    }
}

