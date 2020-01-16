import {AsyncStatus} from "../actions/Async";
import {AllAction} from "../actions/Actions";
import {Dispatch} from "redux";

type AsyncStatusHandler<T> = {
    [K in AsyncStatus]?: (state: T) => T
}

type AsyncAction = Pick<AllAction, "type"> & {
    status: AsyncStatus
}

export function handleAsyncAction<S>(state: S, action: AsyncAction, handler: AsyncStatusHandler<S>): S {
    let fn = handler[action.status]
    if (!fn) {
        fn = (s) => s
    }
    return fn(state)
}

