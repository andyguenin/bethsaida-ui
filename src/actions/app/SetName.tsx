import {ActionTypes} from "../ActionTypes";

export interface SetName {
    type: typeof ActionTypes.SETNAME,
    name: string
}
