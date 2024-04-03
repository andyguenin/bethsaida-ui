import React, {Fragment} from 'react';
import ddb from '../../assets/ddb.svg';
import {withRouter, RouteComponentProps, RouteChildrenProps} from 'react-router-dom'
import Credentials from "../../data/Credentials";
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {clearErrorMessage} from "../../actions/Base";
import ErrorMessage from "./ErrorMessage";


const mapStateToProps = (state: AppState) => ({
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        clearError: () => dispatch(clearErrorMessage())
    };
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

interface RouteProps {
    id: string
}

interface State {
    displayAdmin: boolean
    isAdmin: boolean
}

type Props = PropsFromRedux & RouteChildrenProps<RouteProps>


class TopNav extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            displayAdmin: new Credentials().getDisplayAdmin(),
            isAdmin: new Credentials().isAdmin()
        }
    }

    private toggleDisplayAdmin = (): void => {
        const newCred = new Credentials().toggleDisplayAdmin();
        this.setState(Object.assign({},
            this.state,
            {
                displayAdmin: newCred.getDisplayAdmin()
            }));
    };

    logout() {
        this.props.history.push('/logout');
    }

    render() {
        return (
            <Fragment>


                <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
                        <a className="navbar-brand" href="/"><img src={ddb} id='ddb-logo' alt='Downtown Daily Bread'/> </a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <a className="nav-link" href="/">Home</a>
                            <a className="nav-link" href="/client" id='client'>Clients</a>
                            <a className="nav-link" href="/shelter" id="Shelter">
                                Shelters
                            </a>
                            <a className='nav-link' href='/mail' id='Mail'>
                                Mail
                            </a>
                            <a className='nav-link' href='/meal' id='Meal'>
                                Meal
                            </a>
                            <a className='nav-link' href='/shower' id='Shower'>
                                Showers
                            </a>
                            {
                                (
                                    () => {
                                        if (new Credentials().getDisplayAdmin()) {
                                            return (
                                                <Fragment>
                                                    {/*<a className="nav-link" href="/service" id="Services">Services Management</a>*/}
                                                    <a className='nav-link' href='/admin' id='Admin'>Admin
                                                    </a>
                                                </Fragment>
                                            )
                                        } else {
                                            return <Fragment/>
                                        }

                                    }
                                )()
                            }
                        </ul>
                        <button type='button' className='btn btn-lg btn-outline-dark '
                                onClick={() => window.location.href = '/profile'}>Edit Account
                        </button>
                        <button type='button' className="btn btn-lg btn-outline-danger" onClick={() => this.logout()}>Logout
                        </button>
                    </div>
                </nav>
                <ErrorMessage show={this.props.base.error.enabled} errorMessage={this.props.base.error.message}
                              className='site-error'/>
            </Fragment>

        )
    }

}

export default withRouter(connector(TopNav));