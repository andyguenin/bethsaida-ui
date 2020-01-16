import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Provider, useDispatch} from "react-redux";
import thunkMiddleware, {ThunkMiddleware} from 'redux-thunk';
import {applyMiddleware, compose, createStore} from 'redux';
import {rootReducer} from "./reducers/RootReducer";
import {AppState} from "./reducers/AppState";
import {allClients} from "./services/client/ClientFetcher";


const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, undefined,
    applyMiddleware(thunkMiddleware as ThunkMiddleware<AppState, any>
       //,       (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
       ),

)

store.dispatch(allClients)

ReactDOM.render(
    <Provider store={store}><App /></Provider>
    , document.getElementById('root'));


