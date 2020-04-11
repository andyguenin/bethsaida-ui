import React, {FormEvent, Fragment} from 'react'
import {RouteChildrenProps, withRouter} from "react-router-dom";
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import FileContainer from "../../components/app/FileContainer";
import User from "../../data/User";
import {GetSingleUser, InitialPasswordSet} from "../../services/User";
import {Title} from "../../components/app/Title";
import {Loader} from "../../components/app/loader/Loader";
import PasswordConfirm from "../../components/user/PasswordConfirm";

const mapStateToProps = (state: AppState) => ({base: state.base});

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        confirmAndSetPassword: (email: string, token: string, password: string) => dispatch(InitialPasswordSet(email, token, password))
    };
};

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

interface RouteProps {
    email: string
    token: string
}

type Props = PropsFromRedux & RouteChildrenProps<RouteProps> & {}

interface State {
    password: string
    matchError: boolean
}

class Confirm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            password: '',
            matchError: true
        }
    }

    handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!this.state.matchError) {
            this.props.confirmAndSetPassword(this.props.match?.params.email || '', this.props.match?.params.token || '', this.state.password)
        }
    }

    render() {
        return (
            <div className='row'>
                <div className='offset-1 col-10'>
                <Title name={'Set your password'}/>
                <form onSubmit={this.handleSubmit}>
                    <PasswordConfirm onChange={((matchError, password) => {
                        this.setState(Object.assign({}, this.state, {
                            password,
                            matchError
                        }))
                    })} passwordAlreadyExists={false}/>
                    <div className="form-group row">
                        <div className="col-sm-3 offset-5">
                            <button
                                className="btn btn-primary"
                                disabled={this.state.matchError}
                                type='submit'
                            >Set Password</button>
                        </div>
                    </div>
                </form>
                </div>
            </div>
        );

    }
}

export default withRouter(connector(Confirm))