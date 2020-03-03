import React from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import FileContainer from "../../components/app/FileContainer";
import {ModifyClient} from "../../components/client/ModifyClient";
import ClientBuilder from "../../data/ClientBuilder";
import {NewClientRequest} from "../../services/Client";

const mapStateToProps = (state: AppState) => ({
    client: state.clientState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        newClient: (c: ClientBuilder) => dispatch(NewClientRequest(c, (id) => {
            window.location.href='/client/'+id;
        }))
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux

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