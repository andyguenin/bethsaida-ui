import React, {Fragment} from 'react';
import './App.scss';
import './TopNav';
import TopNav from './TopNav';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ClientList from '../../containers/client/AllClients'
import Home from "../../containers/home/Home";
import NewClient from "../../containers/client/NewClient";
import EditClient from "../../containers/client/EditClient";
import NotFound from "./NotFound";
import ShowClient from "../../containers/client/ShowClient";
import FormUpload from "./FileUpload";
import Login from "../login/Login";

export default class App extends React.Component<{}> {

    public render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/login' component={Login}/>
                    <Route exact path="/upload" component={FormUpload}/>
                    <Route exact path="/client/new" component={NewClient}/>
                    <Route exact path="/client/edit/:id" component={EditClient}/>
                    <Route exact path="/client/:id" component={ShowClient}/>
                    <Route exact path="/client" component={ClientList}/>
                    <Route exact path="/" component={Home}/>
                    <Route path="/" component={NotFound}/>
                </Switch>
            </Router>
            // <Fragment>
            //     <TopNav/>
            //     <div className='container-fluid' id='main-container'>
            //         <Router>
            //
            //         </Router>
            //     </div>
            // </Fragment>
        )
    }
}