import Client from "../data/Client";
import {
    CLIENT_REMOVE,
    CLIENT_SETDATA,
    ClientAction
} from "../actions/Client";


export interface ClientState {
    clients: Client[]
}


export const initialClientState: ClientState = {
    clients: []
}

export function clientReducer(state: ClientState = initialClientState, action: ClientAction) {
    switch (action.type) {
        case CLIENT_SETDATA:
            return Object.assign({}, state, {clients: action.data});
        case CLIENT_REMOVE:
            return Object.assign({}, state, {
                clients: state.clients.filter((c) => {
                    return c.id !== action.id;
                })
            })
        default:
            return state;
    }
}

