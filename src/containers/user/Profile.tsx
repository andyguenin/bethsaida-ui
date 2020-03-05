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
        userNotFound: () => dispatch(setErrorMessage("Cannot find user"))
    };
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

interface RouteProps {
}

interface IState {
    loading: boolean
    user?: User
}

type Props = PropsFromRedux & RouteChildrenProps<RouteProps> & {}

class Profile extends React.Component<Props, IState> {

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: true
        }
    }

    componentDidMount(): void {

        this.props.getSingleUser(new Credentials().getId() || '', (s) => {
            this.setState(Object.assign({},
                this.state,
                {
                    user: s,
                    loading: false
                }))
        })

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

export default withRouter(connector(Profile))