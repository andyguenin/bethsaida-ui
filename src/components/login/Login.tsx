import React, {ChangeEvent, FormEvent} from 'react';
import './login.scss'
import Credentials from "../../data/Credentials";
import {Redirect, RouteComponentProps, withRouter} from 'react-router-dom';
import ddb from '../../assets/ddb.svg'
import {AuthenticateRequest} from "../../services/Authenticate";

interface Props {
    loggedIn: boolean
}

interface IState {
    email: string
    password: string
    errorMessage?: string
    submitDisabled: boolean
}

class Login extends React.Component<RouteComponentProps<any> & Props, IState> {

    private readonly redirect: string;

    private static defaultState: IState = {
        email: '',
        password: '',
        errorMessage: undefined,
        submitDisabled: false
    }

    constructor(props: RouteComponentProps<any> & Props) {
        super(props);
        const search = new URLSearchParams(this.props.location.search);

        this.redirect = search.get("redirect_to") || '/';
        this.state = Login.defaultState;
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
        this.setState({'submitDisabled': true});
        AuthenticateRequest(
            this.state.email,
            this.state.password,
            () => {
                window.location.href = this.redirect;
            },
            (message) => {
                this.setErrorMessage(message);
            }
        );
    };

    private setErrorMessage = (message: string) => {
        this.setState(Object.assign({}, {'errorMessage': message, 'submitDisabled': false}))
    }

    private getErrorMessage = () => {
        const state = (this.state as IState);
        if (state.errorMessage !== undefined) {
            return (
                <div className='alert alert-danger' role='alert'>{state.errorMessage}</div>
            )
        }
    }

    render() {
        if (this.props.loggedIn) {
            return <Redirect to='/'/>
        }
        return (
            <div>
                <div className='container-lg'>
                    <div className='row  d-none d-lg-block'>
                        <div className='col-lg-7 mx-auto'>
                            <div className='card card-signin my-5'>
                                <div className='card-body'>
                                    <img src={ddb} alt='Downtown Daily Bread'/>
                                    <div className='vspace'/>
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
                                        <div className='form-group text-right'>
                                            <a href='/forgot-password'>Forgot Password</a>
                                        </div>
                                        <button
                                            className={"btn btn-lg btn-primary btn-block text-uppercase " + (this.state.submitDisabled ? "disabled" : "")}
                                            type="submit">Sign in
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row d-block d-lg-none'>
                        <img src={ddb} className='col-12 mobile-img'/>
                        <br/><br/>
                        <form onSubmit={this.submitLogin}>
                            <div className='form-group form-group-mobile'>
                                <label htmlFor='inputEmail'>Email Address</label>
                                <input type='email' id='inputEmail' className='form-control form-control-xl'
                                       placeholder='Email Address' required autoFocus
                                       value={this.state.email} onChange={this.updateField('email')}/>
                            </div>
                            <div className="form-group form-group-mobile">
                                <label htmlFor="inputPassword">Password</label>
                                <input type="password" id="inputPassword" className="form-control form-control-xl"
                                       placeholder="Password" required value={this.state.password}
                                       onChange={this.updateField('password')}/>
                            </div>
                            <div className='form-group'>
                                {/*Forgot Password*/}
                            </div>
                            <br/><br/>
                            <div className="form-group form-group-mobile">
                                <button
                                    className={"btn btn-lg btn-primary btn-block btn-mobile text-uppercase " + (this.state.submitDisabled ? "disabled" : "")}
                                    type="submit">Sign in
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}


export default withRouter(Login)