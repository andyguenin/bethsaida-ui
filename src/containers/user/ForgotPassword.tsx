import React, {ChangeEvent, FormEvent, FormEventHandler, Fragment} from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import {withRouter, RouteChildrenProps} from 'react-router-dom'
import {setErrorMessage} from "../../actions/Base";
import PasswordConfirm from "../../components/user/PasswordConfirm";
import {ForgetPassword} from "../../services/User";


const mapStateToProps = (state: AppState) => ({
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        fetchPassword: (email: string) => dispatch(ForgetPassword(email))
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
    email: string
    message?: string
}

type Props = PropsFromRedux & RouteChildrenProps<IRoute>

class ResetPassword extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            email: ''
        }
    }


    private onSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        this.props.fetchPassword(this.state.email)
        this.setState((state, props) => Object.assign({}, state, {
            message: 'You will receive an email at ' + this.state.email +' with further instructions on how to reset your password.'
        }))

    };

    private handleUpdate = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        this.setState((state, props) => Object.assign({}, state, {
            email: value,
        }))
    }

    public render() {
        return (
            <Fragment>
                <Title name='Forgot Password'/>
                <div className={'alert alert-success row ' + (this.state.message === undefined ? 'd-none' : '')}>
                    {this.state.message}
                </div>
                <form onSubmit={this.onSubmit} className='row'>
                    <div className='col-sm-10'>
                        <div className='form-group row'>
                            <label htmlFor='email' className='col-sm-2'>Email Address</label>
                            <input type='text' className='form-control col-sm-10' id='email'
                                   placeholder='Email'
                                   value={this.state.email}
                                   onChange={this.handleUpdate}
                                   autoComplete="off"
                                   required={true}
                            />
                        </div>
                        <div className="form-group row offset-5">
                            <div className="col-sm-3">
                                <button
                                    className="btn btn-primary"
                                    type='submit'
                                >Reset Password
                                </button>
                            </div>
                        </div>
                    </div>

                </form>
            </Fragment>
        )
    }
}

export default withRouter(connector(ResetPassword))