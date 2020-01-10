import React from 'react';
import {applyMiddleware, createStore, Store} from "redux";
import thunk from 'redux-thunk';
import {rootReducer} from "./reducers/Root";

export function configureStore() {
    const store = createStore(rootReducer, undefined, applyMiddleware(thunk));
    return store;
}