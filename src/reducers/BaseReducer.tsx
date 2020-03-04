import {BASE_CREDENTIALS, BASE_ERROR_MESSAGE, BaseAction} from "../actions/Base";
import Credentials from "../data/Credentials";


export interface BaseState {
    error: {
        enabled: boolean,
        message: string
    },
    credentials: Credentials
}

export const initialBaseState: BaseState = {
    error: {
        enabled: false,
        message: ''
    },
    credentials: new Credentials()
}

export function baseReducer(state: BaseState = initialBaseState, action: BaseAction): BaseState {
    switch(action.type) {
        case BASE_ERROR_MESSAGE:
            return Object.assign({}, state, {error: {enabled: action.enabled, message: action.message}});
        case BASE_CREDENTIALS:
            return Object.assign({}, state, {credentials: action.credentials})
        default:
            return state;
    }
}