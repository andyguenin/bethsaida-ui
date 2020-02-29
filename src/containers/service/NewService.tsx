import React from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import FileContainer from "../../components/app/FileContainer";
import ServiceBuilder from "../../data/ServiceBuilder";
import ModifyService from "../../components/service/ModifyService";
import {NewServiceRequest} from "../../services/Service";

const mapStateToProps = (state: AppState) => ({
    service: state.serviceState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        newService: (builder: ServiceBuilder) => dispatch(NewServiceRequest(builder, (id) => {
            window.location.href='/service/'+id;
        }))
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux

class NewService extends React.Component<Props> {

    render() {
        return (
            <FileContainer>
                <Title name="New Service" />
                <ModifyService
                    service={ServiceBuilder.emptyBuilder()}
                    cancelAction={() => window.location.href='/service'}
                    submitAction={(c: ServiceBuilder) => {this.props.newService(c); return true;}}
                    submitText='Create Service'
                />
            </FileContainer>
        )
    }
}

export default connector(NewService)