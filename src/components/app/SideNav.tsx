import React, {Fragment} from 'react';

const SideNav: React.FC = () => {
    return (
        <div className="col-md-2 d-none d-md-block bg-light sidebar">
            <div className="sidebar-sticky">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <a href="/dashboard" className="nav-link"><i className="fa fa-tachometer-alt"></i>Dashboard</a>
                    </li>
                    <li className="nav-item"><a href="/clients" className="nav-link"><i
                        className="fas fa-users"/>Clients</a></li>
                    <li className="nav-item"><a className="nav-link"><i className="fas fa-concierge-bell"/>Services</a>
                    </li>
                    <li className="nav-item"><a className="nav-link"><i
                        className="fas fa-toolbox"/>Admin</a>
                    </li>
                    <li className="nav-item"><a className="nav-link"><i
                        className="fas fa-clipboard-list"/>Reports</a>
                    </li>
                    <hr/>
                </ul>
            </div>
        </div>


    )
}

export default SideNav;