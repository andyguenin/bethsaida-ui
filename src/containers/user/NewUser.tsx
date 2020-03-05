import React from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import FileContainer from "../../components/app/FileContainer";
import ServiceBuilder from "../../data/ServiceBuilder";
import ModifyService from "../../components/service/ModifyService";
import {NewServiceRequest} from "../../services/Service";
import UserBuilder from "../../data/UserBuilder";
import {NewUserRequest} from "../../services/User";
import ModifyUser from "../../components/user/ModifyUser";

const mapStateToProps = (state: AppState) => ({
    service: state.serviceState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        newUser: (builder: UserBuilder) => dispatch(NewUserRequest(builder.build(), (id) => {
            window.location.href='/user/'+id;
        }))
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux

class NewUser extends React.Component<Props> {

    render() {
        return (
            <FileContainer>
                <Title name="New Employee" />
                <ModifyUser
                    user={UserBuilder.emptyBuilder()}
                    cancelAction={() => window.location.href='/user'}
                    submitAction={(c: UserBuilder) => {this.props.newUser(c); return true;}}
                    submitText='Create User'
                    newUser={true}
                    onChange={() => undefined}
                />
            </FileContainer>
        )
    }
}

export default connector(NewUser)