import {BASE_ERROR_MESSAGE, BASE_LOADING_STATUS, BaseAction} from "../actions/Base";


export interface BaseState {
    loadingStatusEnabled: boolean,
    error: {
        enabled: boolean,
        message: string
    }
}

export const initialBaseState: BaseState = {
    loadingStatusEnabled: false,
    error: {
        enabled: false,
        message: ''
    }
}

export function baseReducer(state: BaseState = initialBaseState, action: BaseAction): BaseState {
    switch(action.type) {
        case BASE_ERROR_MESSAGE:
            return Object.assign({}, state, {error: {enabled: action.enabled, message: action.message}});
        case BASE_LOADING_STATUS:
            return Object.assign({}, state, {loadingStatusEnabled: action.loadingStatusEnabled})
        default:
            return state;
    }
}