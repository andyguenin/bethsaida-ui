import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {configureStore} from "./BethsaidaStore";

const store = configureStore();

ReactDOM.render(<App store={store}/>, document.getElementById('root'));
