import React from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";

const mapStateToProps = (state: AppState) => state

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {}
}


const connector = connect(
    mapStateToProps,
    mapDispatchToProps
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}

class Dashboard extends React.Component<Props> {

    public render() {
        return (<Title name='Dashboard' />)
    }
}

export default connector(Dashboard)