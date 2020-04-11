import React, {Fragment} from 'react';
import './App.scss';
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
import AllServices from "../../containers/service/AllServices";
import NewService from "../../containers/service/NewService";
import ShowService from "../../containers/service/ShowService";
import EditService from "../../containers/service/EditService";
import NewEvent from "../../containers/event/NewEvent";
import ActiveEvents from "../../containers/event/ActiveEvents";
import EventsArchive from "../../containers/event/EventsArchive";
import ShowEvent from "../../containers/event/ShowEvent";
import EditEvent from "../../containers/event/EditEvent";
import Maintenance from "./Maintenance";
import StaticUser from "../user/StaticUser";
import ShowUser from "../../containers/user/ShowUser";
import Profile from "../../containers/user/Profile";
import EditUser from "../../containers/user/EditUser";
import AllUsers from "../../containers/user/AllUsers";
import NewUser from "../../containers/user/NewUser";
import ResetPassword from "../../containers/user/ResetPassword";
import BannedClients from "../../containers/client/BannedClients";
import Confirm from "../../containers/user/Confirm";


export default class App extends React.Component<{}> {

    public render() {
        return (
            <Fragment>
                <DevInfo>
                    <Router>
                        <Switch>
                            <Route exact path='/m' component={Maintenance} />
                            <Route exact path='/login' component={Login}/>
                            <Route exact path='/logout' component={Logout}/>
                            <Route exact path='/confirm/:email/:token' component={Confirm} />

                            <Route exact path='/profile' component={Profile} />
                            <Route exact path='/admin' component={AllUsers} />
                            <Route exact path='/reset-password' component={ResetPassword} />
                            <Route exact path='/user/new' component={NewUser} />
                            <Route exact path='/user/:id' component={ShowUser} />
                            <Route exact path='/user/:id/edit' component={EditUser} />

                            <Route exact path='/event' component={ActiveEvents}/>
                            <Route exact path='/event/new' component={NewEvent} />
                            <Route exact path='/event/archive/' component={EventsArchive}/>
                            <Route exact path='/event/:id' component={ShowEvent} />
                            <Route exact path='/event/:id/edit' component={EditEvent} />

                            <Route exact path='/service' component={AllServices} />
                            <Route exact path='/service/new' component={NewService} />
                            <Route exact path='/service/:id' component={ShowService} />
                            <Route exact path='/service/:id/edit' component={EditService} />

                            <Route exact path="/client/new" component={NewClient}/>
                            <Route exact path="/client/banned" component={BannedClients} />
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