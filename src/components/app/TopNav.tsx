import React from 'react';
import ddb from '../../assets/ddb.svg';

const TopNav: React.FC = () => {
    return (
        <nav className="row navbar navbar-dark fixed-top bg-white flex-md-nowrap shadow">
            <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">
                <img src={ddb}/>
            </a>
            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap">
                    <a href="#" className="top-nav-link" data-toggle="tooltip" data-placement="bottom"
                       title="Settings"><i className="fa fa-cogs fa-2x"/></a>
                    <a href="#" className="top-nav-link" data-toggle="tooltip" data-placement="bottom"
                       title="Profile"><i className="fa fa-user fa-2x"/></a></li>
            </ul>
        </nav>)

}

export default TopNav;