import {combineReducers} from "redux";
import {baseReducer} from "./BaseReducer";
import {clientReducer} from "./ClientReducer";

export const rootReducer = combineReducers({
    base: baseReducer,
    client: clientReducer
});
