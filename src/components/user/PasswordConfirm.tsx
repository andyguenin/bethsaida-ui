import React, {Fragment, ChangeEventHandler, ChangeEvent} from 'react';

interface Props {
    onChange: (matchError: boolean, password?: string) => void
    passwordAlreadyExists?: boolean
}

interface State {
    password?: string,
    passwordConfirm?: string
    passwordConfirmModified: boolean
    showError: boolean
    match: boolean
}

export default class PasswordConfirm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            password: '',
            passwordConfirm: '',
            passwordConfirmModified: false,
            showError: false,
            match: false
        }
    }

    private handleTextUpdate(id: string): (e: ChangeEvent<HTMLInputElement>) => void {
        let password = this.state.password;
        let passwordConfirm = this.state.passwordConfirm;
        let passwordConfirmModified = this.state.passwordConfirmModified;
        let match = this.state.match;
        let showError = this.state.showError;
        return (e) => {
            if (id === 'password') {
                password = e.target.value;
            } else if (id === 'passwordConfirm') {
                passwordConfirm = e.target.value;
                passwordConfirmModified = true;
            }

            if (passwordConfirmModified && password === passwordConfirm) {
                match = true;
                showError = false;
            } else {
                match = false;
            }
            this.props.onChange(!match, match ? password : undefined);
            this.setState(Object.assign({},
                this.state,
                {
                    password,
                    passwordConfirm,
                    passwordConfirmModified,
                    match,
                    showError
                }))
        }
    }

    private setError(): () => void {
        return () => {
            const error = this.state.password !== this.state.passwordConfirm && this.state.passwordConfirmModified;
            this.setState(Object.assign({}, this.state, {showError: error}))
        }
    }

    private passwordPlaceholder = (this.props.passwordAlreadyExists || false) ? 'Password (leave blank to keep the same)' : 'Password';

    render() {
        return (
            <Fragment>
                <div className='form-group row'>
                    <label htmlFor='service_name' className='col-sm-2'>Password</label>
                    <input type='password'
                           className='form-control col-sm-10'
                           id='service_name'
                           placeholder={this.passwordPlaceholder}
                           value={this.state.password}
                           onChange={this.handleTextUpdate('password')}
                           onBlur={this.setError()}
                           autoComplete="off"
                    />
                </div>
                <div className='form-group row'>
                    <label htmlFor='service_name' className='col-sm-2'>Password Confirmation</label>
                    <input type='password'
                           className='form-control col-sm-10'
                           id='service_name'
                           placeholder='Password Confirmation'
                           value={this.state.passwordConfirm}
                           onChange={this.handleTextUpdate('passwordConfirm')}
                           onBlur={this.setError()}
                           autoComplete="off"
                    />
                </div>
                {
                    (
                        () => {
                            if (this.state.showError) {
                                return (<div className='row button-row'>
                                    <div className='col-sm-10 offset-sm-2 alert-danger'>
                                        Passwords do not match
                                    </div>
                                </div>)
                            }
                        }
                    )()
                }
            </Fragment>
        )
    }


}