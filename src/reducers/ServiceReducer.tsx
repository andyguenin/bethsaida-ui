import {SERVICE_SETDATA, ServiceAction} from "../actions/Service";

export interface ServiceState {
}

export const initialEventState: ServiceState = {
    services: []
}

export function eventReducer(state: ServiceState = initialEventState, action: ServiceAction) {
    switch(action.type) {
        case SERVICE_SETDATA:
            return Object.assign({}, state, {services: action.data});
        default:
            return state;
    }
}

