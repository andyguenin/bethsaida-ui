import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './components/app/App';
import {Provider} from "react-redux";
import thunkMiddleware, {ThunkMiddleware} from 'redux-thunk';
import {applyMiddleware, createStore} from 'redux';
import {rootReducer} from "./reducers/RootReducer";
import {AppState} from "./reducers/AppState";


export const store = createStore(rootReducer, undefined,
    applyMiddleware(thunkMiddleware as ThunkMiddleware<AppState, any>),

);

ReactDOM.render(
    <Provider store={store}><App /></Provider>
    , document.getElementById('root'));


