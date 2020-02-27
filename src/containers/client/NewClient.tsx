import React from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import FileContainer from "../../components/app/FileContainer";
import {ModifyClient} from "../../components/client/ModifyClient";
import ClientBuilder from "../../data/ClientBuilder";
import {NewClientRequest} from "../../services/Client";
import Client from "../../data/Client";

const mapStateToProps = (state: AppState) => ({
    client: state.clientState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        // loadClient: () => dispatch(GetSingleClient("926d4bc3-2aaa-40de-8c4b-9936c1f002ce"))
        newClient: (c: ClientBuilder) => dispatch(NewClientRequest(c))
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    abc: string
}

class NewClient extends React.Component<Props> {

    render() {
        return (
            <FileContainer>
                <Title name="New Client" />
                <ModifyClient
                    clientBuilder={ClientBuilder.emptyBuilder()}
                    cancelAction={() => window.location.href='/client'}
                    submitAction={(c: ClientBuilder) => {this.props.newClient(c); return true}}
                    submitText='Create Client'
                />
            </FileContainer>
        )
    }
}

export default connector(NewClient)