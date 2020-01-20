import React, {Fragment} from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import {ModifyClient} from "../../components/client/ModifyClient";

const mapStateToProps = (state: AppState) => ({
    client: state.client,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        // loadClient: () => dispatch(GetSingleClient("926d4bc3-2aaa-40de-8c4b-9936c1f002ce"))
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}

class NewClient extends React.Component<Props> {

    componentDidMount(): void {
        // this.props.loadClient()
    }

    render() {
        return (
            <Fragment>
                <Title name="New Client" />
                <ModifyClient client={this.props.client.workingClient} cancelAction={() => window.location.href='/client'}/>
            </Fragment>
        )
    }
}

export default connector(NewClient)