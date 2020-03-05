import React, {Fragment} from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {withRouter, RouteChildrenProps} from 'react-router-dom'
import FileContainer from "../../components/app/FileContainer";
import {Title} from "../../components/app/Title";
import Service from "../../data/Service";
import {Loader} from "../../components/app/loader/Loader";
import {DeleteService, GetSingleService} from "../../services/Service";
import Credentials from "../../data/Credentials";
import User from "../../data/User";
import {GetSingleUser} from "../../services/User";
import {setErrorMessage} from "../../actions/Base";
import StaticUser from "../../components/user/StaticUser";

const mapStateToProps = (state: AppState) => ({
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        getSingleUser: (id: string, action: (s: User) => void) => dispatch(GetSingleUser(id, action)),
        userNotFound: () => dispatch(setErrorMessage("ddCannot find user"))
    };
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

interface RouteProps {
    id: string
}

interface IState {
    loading: boolean
    id?: string
    user?: User
}

type Props = PropsFromRedux & RouteChildrenProps<RouteProps> & {
    id?: string
}

class ShowUser extends React.Component<Props, IState> {

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: true,
            id: (this.props.match?.params.id === undefined ? this.props.id : this.props.match?.params.id)
        }
    }

    componentDidMount(): void {
        if (this.state.id !== undefined) {
            this.props.getSingleUser(this.state.id, (s) => {
                this.setState(Object.assign({},
                    this.state,
                    {
                        user: s,
                        loading: false
                    }))
            })
        } else {
            this.props.userNotFound();
        }
    }

    render() {
        return (
            <FileContainer>
                <Loader loading={this.state.user === undefined} emptyText='User not found'
                        isEmpty={this.state.user === undefined}>
                    {this.state.user === undefined ? <Fragment/> : <StaticUser user={this.state.user}/>}
                </Loader>
            </FileContainer>
        )
    }
}

export default withRouter(connector(ShowUser))