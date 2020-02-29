import React, {Fragment} from 'react';
import './App.scss';
import './TopNav';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ClientList from '../../containers/client/AllClients'
import Home from "../../containers/home/Home";
import NewClient from "../../containers/client/NewClient";
import EditClient from "../../containers/client/EditClient";
import NotFound from "./NotFound";
import ShowClient from "../../containers/client/ShowClient";
import Logout from "../login/Logout";
import Login from "../login/Login";
import DevInfo from "./DevInfo";
import AllEvents from "../../containers/event/AllEvents";
import AllServices from "../../containers/service/AllServices";
import NewService from "../../containers/service/NewService";
import ShowService from "../../containers/service/ShowService";
import EditService from "../../containers/service/EditService";
import NewEvent from "../../containers/event/NewEvent";

export default class App extends React.Component<{}> {

    public render() {
        return (
            <Fragment>
                <DevInfo>
                    <Router>
                        <Switch>
                            <Route exact path='/login' component={Login}/>
                            <Route exact path='/logout' component={Logout}/>

                            <Route exact path='/event' component={AllEvents} />
                            <Route exact path='/event/new' component={NewEvent} />

                            <Route exact path='/service' component={AllServices} />
                            <Route exact path='/service/new' component={NewService} />
                            <Route exact path='/service/:id' component={ShowService} />
                            <Route exact path='/service/:id/edit' component={EditService} />

                            <Route exact path="/client/new" component={NewClient}/>
                            <Route exact path="/client/:id/edit" component={EditClient}/>
                            <Route exact path="/client/:id" component={ShowClient}/>
                            <Route exact path="/client" component={ClientList}/>

                            <Route exact path="/" component={Home}/>
                            <Route path="/" component={NotFound}/>
                        </Switch>
                    </Router>
                </DevInfo>
            </Fragment>
        )
    }
}