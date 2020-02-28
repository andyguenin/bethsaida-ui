import React from 'react';
import ddb from '../../assets/ddb.svg';
import {withRouter, RouteComponentProps} from 'react-router-dom'
import Credentials from "../../data/Credentials";


class TopNav extends React.Component<RouteComponentProps<any>> {

    logout() {
        this.props.history.push('/logout');
    }

    render() {
        return (

            <nav className="navbar navbar-expand-md navbar-light bg-light shadow">
                <a className="navbar-brand" href="/"><img src={ddb} height='50px' alt='Downtown Daily Bread'/> </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"> </span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/">Home</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link" href="/client" id='client'>Clients</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link" href="/services" id="services">
                                Services
                            </a>
                        </li>
                        {
                            (<a href='/admin' className='nav-link'>Admin</a> )
                        }
                    </ul>
                    {/*<form className="form-inline my-2 my-md-0 mr-sm-2">*/}
                    {/*    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>*/}
                    {/*    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>*/}
                    {/*</form>*/}
                    <button type='button' className="btn btn-outline-danger" onClick={() => this.logout()}>Logout
                    </button>
                </div>
            </nav>

        )
    }

}

export default withRouter(TopNav);