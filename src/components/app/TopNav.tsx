import React, {Fragment} from 'react';
import ddb from '../../assets/ddb.svg';
import {withRouter, RouteComponentProps, RouteChildrenProps} from 'react-router-dom'
import Credentials from "../../data/Credentials";
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {clearErrorMessage} from "../../actions/Base";


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
                <nav className="navbar navbar-expand-md navbar-light bg-light shadow">
                    <a className="navbar-brand" href="/"><img src={ddb} height='50px' alt='Downtown Daily Bread'/> </a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"> </span>
                    </button>


                    <ul className="navbar-nav mr-auto">

                        <a className="nav-link" href="/">Home</a>

                        <a className="nav-link" href="/client" id='client'>Clients</a>


                        <a className="nav-link" href="/event" id="Events">
                            Events
                        </a>


                        {
                            (
                                () => {
                                    if (new Credentials().getDisplayAdmin()) {
                                        return (
                                            <Fragment>
                                                <a className="nav-link" href="/service" id="Services">Services</a>
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
                    {/*<form className="form-inline my-2 my-md-0 mr-sm-2">*/}
                    {/*    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>*/}
                    {/*    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>*/}
                    {/*</form>*/}
                    {
                        (() => {
                            if (this.state.isAdmin) {
                                return <button type='button' className='btn btn-outline-dark'
                                               onClick={this.toggleDisplayAdmin}>
                                    Toggle admin {this.state.displayAdmin ? 'off' : 'on'}
                                </button>
                            } else {
                                return <Fragment/>
                            }
                        })()
                    }
                    <button type='button' className='btn btn-outline-dark '
                            onClick={() => window.location.href = '/profile'}>Edit Account
                    </button>
                    <button type='button' className="btn btn-outline-danger" onClick={() => this.logout()}>Logout
                    </button>
                </nav>
                {

                    (() => {
                        if (this.props.base.error.enabled) {
                            return <div className='alert alert-danger site-error row'>
                                <div className='col-11'>
                                    {this.props.base.error.message}
                                </div>
                                <div className='pointer col-1 text-right' onClick={this.props.clearError}>
                                    &times;
                                </div>
                            </div>
                        } else {
                            return <Fragment/>
                        }
                    })()

                }

            </Fragment>

        )
    }

}

export default withRouter(connector(TopNav));