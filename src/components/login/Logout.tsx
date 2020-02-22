import React from 'react';
import Credentials from "../../data/Credentials";
import {Redirect} from 'react-router-dom';

export default class Logout extends React.Component<{}> {
    constructor() {
        super({});
        Credentials.clearCredentials();
    }

    render() {
        return (
            <Redirect to='/'/>
        )
    }
}