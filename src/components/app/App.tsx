import React, {Fragment} from 'react';
import './App.scss';
import './TopNav';
import TopNav from './TopNav';
import {BottomWrapper} from "./BottomWrapper";
import {BrowserRouter as Router, Route} from 'react-router-dom';
import ClientList from '../../containers/client/ClientList'


export default class App extends React.Component<{}> {

    public render() {
        return (
            <Fragment>
                <TopNav/>
                <BottomWrapper>
                    <Router>
                        <Route path="/clients" component={ClientList}/>
                    </Router>
                </BottomWrapper>
            </Fragment>
        )
    }
}