import React, {ChangeEvent, FormEvent} from 'react';
import './login.scss'
import Credentials from "../../data/Credentials";
import {apiRequest, RequestType} from "../../util/HttpRequest";
import {Redirect, RouteComponentProps, withRouter} from 'react-router-dom';
import ddb from '../../assets/ddb.svg'
import Env from "../../environment/Env";


interface IState {
    email: string
    password: string
    errorMessage?: string
}

class Login extends React.Component<RouteComponentProps<any>, IState> {
    private static dProps: IState = {
        email: '',
        password: '',
        errorMessage: undefined
    }

    constructor(props: RouteComponentProps<any>) {
        super(props);
        this.state = Login.dProps
        this.updateField = this.updateField.bind(this)
    }

    updateField = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
        let newState: any = {};
        newState[field] = e.target.value;
        const target = Object.assign({}, this.state, newState);
        this.setState(target)
    }

    public submitLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const credentials = this.state as IState;
        apiRequest('/authenticate', RequestType.POST, (xhr: XMLHttpRequest) => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    this.clearErrorMessage();
                    const response: any = JSON.parse(xhr.responseText);
                    if(response['auth_token'] !== undefined) {
                        Credentials.setCredentials(response['auth_token']);
                        this.props.history.push('/')
                    }
                    if (response['error'] === 'PasswordDoesNotMatch') {
                        this.setErrorMessage('Password is not correct. Please try again.')
                    }
                    if (response['error'] === 'UserNotFound') {
                        this.setErrorMessage('User not found. Please enter in a valid user.');
                    }
                    if (response['error'] === 'UserAccountNotConfirmed') {
                        this.setErrorMessage('Please confirm your account via the link provided to you in an email.');
                    }
                }
            },
            credentials
        );
    };

    private setErrorMessage = (message: string) => {
        this.setState(Object.assign({}, {'errorMessage': message}))
    }
    private clearErrorMessage = () => {
        this.setState(Object.assign({}, {'errorMessage': undefined}))
    }

    private getErrorMessage = () => {
        const state = (this.state as IState);
        if(state.errorMessage !== undefined) {
            return (
                <div className='alert alert-danger' role='alert'>{state.errorMessage}</div>
            )
        }
    }

    render() {
        if(new Credentials().isLoggedIn()) {
            return <Redirect to='/' />
        }
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col-sm-9 col-md-7 col-log-5 mx-auto'>
                        <div className='card card-signin my-5'>
                            <div className='card-body'>
                                <img src={ddb} alt='Downtown Daily Bread'/>
                                <div className='vspace' />
                                {this.getErrorMessage()}
                                <form className='form-signin' onSubmit={this.submitLogin}>
                                    <div className='form-label-group'>
                                        <input type='email' id='inputEmail' className='form-control'
                                               placeholder='Email Address' required autoFocus
                                               value={this.state.email} onChange={this.updateField('email')}/>
                                        <label htmlFor='inputEmail'>Email Address</label>
                                    </div>
                                    <div className="form-label-group">
                                        <input type="password" id="inputPassword" className="form-control"
                                               placeholder="Password" required value={this.state.password}
                                               onChange={this.updateField('password')}/>
                                        <label htmlFor="inputPassword">Password</label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-3">
                                        <input type="checkbox" className="custom-control-input" id="customCheck1"/>
                                        <label className="custom-control-label" htmlFor="customCheck1">Remember
                                            password</label>
                                    </div>
                                    <button className="btn btn-lg btn-primary btn-block text-uppercase"
                                            type="submit">Sign in
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default withRouter(Login)