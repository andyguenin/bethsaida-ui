import React, {Fragment} from 'react';
import {Redirect} from 'react-router-dom';
import TopNav from "./TopNav";
import Credentials from "../../data/Credentials";

export default class FileContainer extends React.Component<{}> {
    render() {
        if(!new Credentials().isLoggedIn()) {
            return (<Redirect to='/login'/>);
        }
        return (
          <Fragment>
              <TopNav/>
              <div className='container-fluid' id='main-container'>
                  {this.props.children}
              </div>
          </Fragment>
        );
    }
}