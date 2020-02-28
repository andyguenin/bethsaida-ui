import React from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import {withRouter, RouteChildrenProps} from 'react-router-dom'
import {Loader} from "../../components/app/loader/Loader";
import FileContainer from "../../components/app/FileContainer";
import {ModifyClient} from "../../components/client/ModifyClient";
import ClientBuilder from "../../data/ClientBuilder";
import {GetSingleClient, UpdateClient} from "../../services/Client";
import Client from "../../data/Client";
import ErrorMessage from "../../components/app/ErrorMessage";


const mapStateToProps = (state: AppState) => ({
    client: state.clientState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        loadClient: (id: string, action: (c: Client) => void) => dispatch(GetSingleClient(id, action)),
        updateClient: (client: ClientBuilder, action: (id: string) => void, failure: (message: string) => void): boolean => {
            dispatch(UpdateClient(
                client,
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
    loadedClient?: Client,
    loading: boolean,
    errorMessage?: string
}

type Props = PropsFromRedux & RouteChildrenProps<IRoute> & {}

class EditClient extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            loadedClient: undefined,
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
            this.props.loadClient(this.props.match?.params.id, (c) => {
                this.setState(
                    Object.assign(
                        {},
                        this.state,
                        {
                            loadedClient: c,
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
                <Loader loading={this.state.loading}>
                    <ErrorMessage errorMessage={this.state.errorMessage}/>
                    {
                        this.state.loadedClient === undefined ? undefined : (
                            <ModifyClient
                                clientBuilder={ClientBuilder.load(this.state.loadedClient)}
                                submitText='Edit Client'
                                submitAction={(cb) => this.props.updateClient(cb, (id) => {
                                    window.location.href = '/client/' + id;
                                }, this.setErrorMessage)}
                                cancelAction={() => window.location.href = '/client/' + this.props.match?.params.id}
                            />
                        )}
                </Loader>
            </FileContainer>
        )
    }
}

export default withRouter(connector(EditClient))