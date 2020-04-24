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
import NewAttendance from "../../containers/attendance/NewAttendance";
import ActiveAttendance from "../../containers/attendance/ActiveAttendance";
import AttendanceArchive from "../../containers/attendance/AttendanceArchive";
import ShowAttendance from "../../containers/attendance/ShowAttendance";
import EditAttendance from "../../containers/attendance/EditAttendance";
import Maintenance from "./Maintenance";
import ShowUser from "../../containers/user/ShowUser";
import Profile from "../../containers/user/Profile";
import EditUser from "../../containers/user/EditUser";
import AllUsers from "../../containers/user/AllUsers";
import NewUser from "../../containers/user/NewUser";
import ResetPassword from "../../containers/user/ResetPassword";
import Confirm from "../../containers/user/Confirm";
import AllLockers from "../../containers/lockers/AllLockers";
import AllMail from "../../containers/mail/AllMail";
import ForgotPassword from "../../containers/user/ForgotPassword";
import AllShowers from "../../containers/shower/AllShowers";


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
                            <Route exact path='/forgot-password' component={ForgotPassword} />

                            <Route exact path='/profile' component={Profile} />
                            <Route exact path='/admin' component={AllUsers} />
                            <Route exact path='/reset-password' component={ResetPassword} />
                            <Route exact path='/user/new' component={NewUser} />
                            <Route exact path='/user/:id' component={ShowUser} />
                            <Route exact path='/user/:id/edit' component={EditUser} />

                            <Route exact path='/shelter' component={ActiveAttendance}/>
                            <Route exact path='/shelter/new' component={NewAttendance} />
                            <Route exact path='/shelter/archive/' component={AttendanceArchive}/>
                            <Route exact path='/shelter/:id' component={ShowAttendance} />
                            <Route exact path='/shelter/:id/edit' component={EditAttendance} />

                            <Route exact path='/service' component={AllServices} />
                            <Route exact path='/service/new' component={NewService} />
                            <Route exact path='/service/:id' component={ShowService} />
                            <Route exact path='/service/:id/edit' component={EditService} />

                            <Route exact path="/client/new" component={NewClient}/>
                            <Route exact path="/client/:id/edit" component={EditClient}/>
                            <Route exact path="/client/:id" component={ShowClient}/>
                            <Route exact path="/client" component={ClientList}/>

                            <Route exact path="/locker" component={AllLockers} />

                            <Route exact path='/mail' component={AllMail} />

                            <Route exact path='/shower' component={AllShowers} />

                            <Route exact path="/" component={Home}/>
                            <Route path="/" component={NotFound}/>
                        </Switch>
                    </Router>
                </DevInfo>
            </Fragment>
        )
    }
}