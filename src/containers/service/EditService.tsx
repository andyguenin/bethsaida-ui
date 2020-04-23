import React from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import {withRouter, RouteChildrenProps} from 'react-router-dom'
import {Loader} from "../../components/app/loader/Loader";
import FileContainer from "../../components/app/FileContainer";
import ErrorMessage from "../../components/app/ErrorMessage";
import Service from "../../data/Service";
import {GetSingleService, UpdateService} from "../../services/Service";
import ServiceBuilder from "../../data/ServiceBuilder";
import ModifyService from "../../components/service/ModifyService";


const mapStateToProps = (state: AppState) => ({
    service: state.serviceState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        loadService: (id: string, action: (service: Service) => void) => dispatch(GetSingleService(id, action)),
        updateService: (service: ServiceBuilder, action: (id: string) => void, failure: (message: string) => void): boolean => {
            dispatch(UpdateService(
                service,
                action,
                failure
            ))
            return true
        }
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

interface IRoute {
    id: string
}

interface State {
    loadedService?: Service,
    loading: boolean,
    errorMessage?: string
}

type Props = PropsFromRedux & RouteChildrenProps<IRoute> & {}

class EditService extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            loadedService: undefined,
            loading: true
        }

    }

    private setErrorMessage = (message: string): void => {
        this.setState(
            Object.assign({},
                this.state,
                {
                    errorMessage: message
                }
            )
        )
    }

    componentDidMount(): void {
        if (this.props.match?.params) {
            this.props.loadService(this.props.match?.params.id, (s) => {
                this.setState(
                    Object.assign(
                        {},
                        this.state,
                        {
                            loadedService: s,
                            loading: false
                        }
                    )
                )
            })
        }
    }

    public render() {
        return (
            <FileContainer>
                <Title name="Edit Client"/>
                <Loader
                    loading={this.state.loading}
                    isEmpty={this.state.loadedService === undefined}
                    emptyText='No matching client found'
                >
                    <ErrorMessage errorMessage={this.state.errorMessage}/>
                    <ModifyService
                        service={ServiceBuilder.load(this.state.loadedService)}
                        submitText='Edit Service'
                        submitAction={(cb) => this.props.updateService(cb, (id) => {
                            window.location.href = '/service/' + id;
                        }, this.setErrorMessage)}
                        cancelAction={() => window.location.href = '/service/' + this.props.match?.params.id}
                    />
                </Loader>
            </FileContainer>
        )
    }
}

export default withRouter(connector(EditService))