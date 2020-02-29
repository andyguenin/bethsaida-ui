import {combineReducers} from "redux";
import {baseReducer} from "./BaseReducer";
import {clientReducer} from "./ClientReducer";
import {eventReducer} from "./EventReducer";

export const rootReducer = combineReducers({
    base: baseReducer,
    clientState: clientReducer,
    eventState: eventReducer
});
