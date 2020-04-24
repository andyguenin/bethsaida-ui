import React from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import FileContainer from "../../components/app/FileContainer";
import {ModifyClient} from "../../components/client/ModifyClient";
import ClientBuilder from "../../data/ClientBuilder";
import {NewClientRequest} from "../../services/Client";
import User from "../../data/User";
import {GetAllUsers} from "../../services/User";
import Credentials from "../../data/Credentials";

const mapStateToProps = (state: AppState) => ({
    client: state.clientState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        newClient: (c: ClientBuilder) => dispatch(NewClientRequest(c, (id) => {
            window.location.href='/client/'+id;
        })),
        getAllUsers: (action: (u: User[]) => void) => dispatch(GetAllUsers(action))
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux

interface State {
    users: User[]
    currentUser?: User
}

class NewClient extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            users: []
        }
    }

    componentDidMount(): void {
        this.props.getAllUsers((users) => {
            const currentUser = users.find((u) => u.id === new Credentials().getId())
            this.setState((state, props) => Object.assign({}, state, {users, currentUser}))
        })
    }

    render() {
        const builder = ClientBuilder.emptyBuilder().setIntakeUser(this.state.currentUser)
        return (
            <FileContainer>
                <Title name="New Client" />
                <ModifyClient
                    clientBuilder={builder}
                    cancelAction={() => window.location.href='/client'}
                    submitAction={(c: ClientBuilder) => {this.props.newClient(c); return true}}
                    submitText='Create Client'
                    users={this.state.users}
                />
            </FileContainer>
        )
    }
}

export default connector(NewClient)