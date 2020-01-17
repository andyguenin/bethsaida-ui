import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {AppState} from "../reducers/AppState";
import {AllAction} from "./Actions";

export type AsyncAction = ThunkAction<void, AppState, void, AllAction>
export type AsyncDispatch = ThunkDispatch<AppState, void, AllAction>