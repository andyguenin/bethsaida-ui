import React from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import {withRouter, RouteChildrenProps} from 'react-router-dom'
import {Loader} from "../../components/app/loader/Loader";
import FileContainer from "../../components/app/FileContainer";
import {ModifyClient} from "../../components/client/ModifyClient";
import ClientBuilder from "../../data/ClientBuilder";
import {GetSingleClient, UpdateClient} from "../../services/Client";
import Client from "../../data/Client";
import ErrorMessage from "../../components/app/ErrorMessage";
import Service from "../../data/Service";
import {GetSingleService, UpdateService} from "../../services/Service";
import ServiceBuilder from "../../data/ServiceBuilder";
import ModifyService from "../../components/service/ModifyService";
import User from "../../data/User";
import {GetSingleUser, UpdateUser} from "../../services/User";
import ModifyUser from "../../components/user/ModifyUser";
import UserBuilder from "../../data/UserBuilder";
import {setErrorMessage} from "../../actions/Base";
import PasswordConfirm from "../../components/user/PasswordConfirm";


const mapStateToProps = (state: AppState) => ({
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        updatePassword: (password?: string) => dispatch(setErrorMessage(password || '')),
        setError: (s: string) => dispatch(setErrorMessage(s))
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

interface IRoute {
    id: string
}

interface State {
    password?: string,
    passwordError: boolean
    disableInputs: boolean

}

type Props = PropsFromRedux & RouteChildrenProps<IRoute>

class ResetPassword extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            passwordError: false,
            disableInputs: false
        }
    }

    private setErrorMessage = (message: string): void => {
       this.props.setError(message)
    }


    private onPasswordChange = (matchError: boolean, password?: string): void => {
        this.setState(Object.assign(
            {},
            this.state,
            {
                password,
                passwordError: matchError
            }
        ))
    };

    private onSubmit = (): void => {
        if(this.state.passwordError) {
            this.setErrorMessage("Passwords do not match")
        } else {
            this.props.updatePassword(this.state.password)
        }
    };

    public render() {
        return (
            <FileContainer>
                <Title name='Change Password'/>
                <form onSubmit={this.onSubmit}>
                    <PasswordConfirm onChange={this.onPasswordChange} />
                    <div className="form-group row">
                        <div className='offset-sm-3 col-sm-3'>
                            <button
                                type='button'
                                className="btn btn-danger"
                                onClick={() => window.location.href='/profile'}
                                disabled={this.state.disableInputs}
                            >
                                Cancel Changes
                            </button>
                        </div>
                        <div className="col-sm-3">
                            <button
                                className="btn btn-primary"
                                disabled={this.state.disableInputs}
                                type='submit'
                            >Change Password</button>
                        </div>
                    </div>
                </form>
            </FileContainer>
        )
    }
}

export default withRouter(connector(ResetPassword))