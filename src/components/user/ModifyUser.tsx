import React, {ChangeEvent, FormEvent} from 'react';
import UserBuilder from "../../data/UserBuilder";
import PasswordConfirm from "./PasswordConfirm";
import Credentials from "../../data/Credentials";


interface Props {
    user: UserBuilder;
    submitText: string
    cancelAction: () => void
    submitAction: (c: UserBuilder, passwordError: boolean) => void
    onChange: (c: UserBuilder) => void
    newUser: boolean
}

interface State {
    user: UserBuilder
    disableInputs: boolean
    passwordError: boolean
}

export default class ModifyUser extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            user: this.props.user,
            disableInputs: false,
            passwordError: false
        }
    }

    private handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.props.submitAction(this.state.user, this.state.passwordError);
    }

    private handleTextUpdate(field: string): (e: ChangeEvent<HTMLInputElement>) => void {
        return (e) => {
            const newState: State = Object.assign({}, this.state, {user: this.state.user.setField(field, e.target.value)});
            this.setState(newState);
            this.props.onChange(newState.user);
        }
    }

    private handleCheckUpdate(field: string): (e: ChangeEvent<HTMLInputElement>) => void {
        return (e) => {
            const newState: State =
                Object.assign({}, this.state, {user: this.state.user.setField(field, e.target.checked ? 'true' : 'false')});
            this.setState(newState);
            this.props.onChange(newState.user);
        }
    }

    private handlePasswordUpdate = (error: boolean, password?: string): void => {
        const user = !error ?
            this.state.user.setField('password', password === undefined ? '' : password) :
            this.state.user.setField('password', '');

        const newState = Object.assign({}, this.state, {user, passwordError: error});
        this.setState(newState);

    }

    render() {
        return (
            <div className='row'>
                <div className='offset-1 col-10'>
                    <form onSubmit={this.handleSubmit}>
                        <div className='form-group row'>
                            <label htmlFor='name' className='col-sm-2'>Name</label>
                            <input type='text'
                                   className='form-control col-sm-10'
                                   id='name'
                                   placeholder='Name'
                                   value={this.state.user.getName()}
                                   onChange={this.handleTextUpdate('name')}
                                   autoComplete="off"
                                   required={true}
                            />
                        </div>
                        <div className='form-group row'>
                            <label htmlFor='email' className='col-sm-2'>Email</label>
                            <input type='text'
                                   className='form-control col-sm-10'
                                   id='email'
                                   placeholder='Email'
                                   value={this.state.user.getEmail()}
                                   onChange={this.handleTextUpdate('email')}
                                   autoComplete="off"
                                   required={true}
                            />
                        </div>
                        {
                            (
                                () => {
                                    if (!this.props.newUser) {
                                        return <PasswordConfirm onChange={(error, password) => {
                                            this.handlePasswordUpdate(error, password);
                                        }} passwordAlreadyExists={!this.props.newUser}/>
                                    }
                                }
                            )()
                        }
                        <div className='form-group row'>
                            <label htmlFor='admin' className='col-sm-2'>Admin</label>
                            <input type='checkbox' id='admin' checked={this.state.user.getAdmin()} onChange={
                                this.handleCheckUpdate('admin')
                            } disabled={new Credentials().getId() == this.state.user.getId()}/>
                        </div>
                        <div className="form-group row">
                            <div className='offset-sm-3 col-sm-3'>
                                <button
                                    type='button'
                                    className="btn btn-danger"
                                    onClick={this.props.cancelAction}
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
                                >{this.props.submitText}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }


}