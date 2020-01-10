import {AppActions} from "../actions/app/AppActions";
import SetName from "../actions/app/SetName"

export interface AppState {
    name: string
}

const initialAppState: AppState = {
    name: "loading..."
}

export function appReducer(state = initialAppState, action: AppActions): AppState {
    switch(action.type) {
        case SetName:
            return {
                name: action.name
            }
        default:
            return state;
    }
}