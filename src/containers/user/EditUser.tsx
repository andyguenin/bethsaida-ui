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


const mapStateToProps = (state: AppState) => ({
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        loadUser: (id: string, action: (u: User) => void) => dispatch(GetSingleUser(id, action)),
        updateUser: (u: User, action: (u: string) => void) => dispatch(UpdateUser(u, action))
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
    user?: User,
    loading: boolean,
    errorMessage?: string,
    formUserBuilder: UserBuilder
}

type Props = PropsFromRedux & RouteChildrenProps<IRoute> & {}

class EditUser extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            user: undefined,
            loading: true,
            formUserBuilder: UserBuilder.emptyBuilder()
        }

    }

    private setErrorMessage = (message: string): void => {
        this.setState(
            Object.assign({},
                this.state,
                {
                    errorMessage: message
                }
            )
        )
    }

    componentDidMount(): void {
        if (this.props.match?.params) {
            this.props.loadUser(this.props.match?.params.id, (s) => {
                this.setState(
                    Object.assign(
                        {},
                        this.state,
                        {
                            user: s,
                            loading: false,
                            formUserBuilder: UserBuilder.load(s)
                        }
                    )
                )
            })
        }
    }

    private onSubmit = (cb: UserBuilder, passwordError: boolean): void => {
      if(passwordError) {
          this.setErrorMessage("Passwords do not match")
      } else {
          this.props.updateUser(cb.build(), (id) => {
              window.location.href = '/user/' + id
          })
      }
    };

    public render() {
        return (
            <FileContainer>
                <Title name={'Edit User - ' + this.state.formUserBuilder.getName()}/>
                <Loader
                    loading={this.state.loading}
                    isEmpty={this.state.user === undefined}
                    emptyText='No matching user found'
                >
                    <ErrorMessage errorMessage={this.state.errorMessage}/>
                    <ModifyUser
                        user={UserBuilder.load(this.state.user)}
                        submitText='Edit User'
                        submitAction={this.onSubmit}
                        cancelAction={() => window.location.href = '/user/' + this.props.match?.params.id}
                        onChange={(c) => {this.setState(Object.assign({}, this.state, {formUserBuilder: c}))}}
                        newUser={false}
                    />
                </Loader>
            </FileContainer>
        )
    }
}

export default withRouter(connector(EditUser))