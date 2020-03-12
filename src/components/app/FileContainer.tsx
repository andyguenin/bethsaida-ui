import React, {Fragment} from 'react';
import {withRouter, Redirect, RouteChildrenProps} from 'react-router-dom';
import TopNav from "./TopNav";
import Credentials from "../../data/Credentials";
import {connect, ConnectedProps} from "react-redux";
import {createBrowserHistory} from 'history'


const connector = connect()

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteChildrenProps<{}>

class FileContainer extends React.Component<Props> {

    private redirectTo: string | undefined = undefined

    constructor(props: Props) {
        super(props);

        const redirect = this.props.location.pathname;
        if (!new Credentials().isLoggedIn() && !redirect.includes("/login")) {
            let redirectText: string = '/login'

            if (redirect !== '/') {
                redirectText = redirectText + "?redirect_to=" + encodeURIComponent(redirect)
            }
            this.redirectTo = redirectText;
        }
    }

    render() {
        if (this.redirectTo !== undefined) {
            return <Redirect to={this.redirectTo}/>
        } else {
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
}

export default withRouter(connector(FileContainer))