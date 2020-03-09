import React, {ChangeEvent, Fragment, MouseEventHandler} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AppState} from "../../reducers/AppState";
import {Loader} from "../../components/app/loader/Loader"
import './Client.scss';
import {AsyncDispatch} from "../../actions/Async";
import {DeleteClient, GetAllClients} from "../../services/Client";
import {Title} from "../../components/app/Title";
import Client from "../../data/Client";
import FileContainer from "../../components/app/FileContainer";
import Env from "../../environment/Env";
import Credentials from "../../data/Credentials";
import ClientBuilder from "../../data/ClientBuilder";
import {Gender} from "../../data/Gender";
import {Race} from "../../data/Race";
import DateUtil from "../../util/DateUtil";


const mapStateToProps = (state: AppState) => ({
    clientState: state.clientState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        loadAllClients: (updateFunc: (clients: Client[]) => void) => dispatch(GetAllClients(updateFunc))
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
)
type PropsFromRedux = ConnectedProps<typeof connector>

// if we want to add in other props required for the tag that aren't part of the state
type Props = PropsFromRedux & {}

interface State {
    gridClients: Client[]
    loading: boolean
    filterText: string
}

class BannedClients extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    componentDidMount(): void {
    }



    public render() {
        return <div></div>
    }

}


export default connector(BannedClients)