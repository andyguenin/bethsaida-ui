import {BASE_ERROR_MESSAGE, BaseAction} from "../actions/Base";


export interface BaseState {
    error: {
        enabled: boolean,
        message: string
    }
}

export const initialBaseState: BaseState = {
    error: {
        enabled: false,
        message: ''
    }
}

export function baseReducer(state: BaseState = initialBaseState, action: BaseAction): BaseState {
    switch(action.type) {
        case BASE_ERROR_MESSAGE:
            return Object.assign({}, state, {error: {enabled: action.enabled, message: action.message}});
        default:
            return state;
    }
}