import React, {Fragment} from 'react';
import './App.scss';
import './TopNav';
import TopNav from './TopNav';
import {BottomWrapper} from "./BottomWrapper";
import '../client/ClientPage'
import {BrowserRouter as Router, Route} from 'react-router-dom';
import ClientPage from "../client/ClientPage";
import {Provider} from "react-redux";
// import BethsaidaStore from "../../BethsaidaStore";
import {Store} from "redux";
import {RootState} from "../../reducers/Root";


export default class App extends React.Component<RootState> {

    public render() {
        return (
            <Provider store={this.props.app}>
                <TopNav/>
                <BottomWrapper>
                    <Router>
                        <Route path="/clients" component={ClientPage}/>
                    </Router>
                </BottomWrapper>
            </Provider>
        )
    }
}