import React from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import {withRouter, RouteChildrenProps} from 'react-router-dom'
// import {GetSingleClient} from "../../services/Client";
import {Loader} from "../../components/app/loader/Loader";
import FileContainer from "../../components/app/FileContainer";


const mapStateToProps = (state: AppState) => ({
    client: state.clientState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        // loadClient: (id: string) => dispatch(GetSingleClient(id))
        loadClient: (id: string) => undefined
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

type Props = PropsFromRedux & RouteChildrenProps<IRoute> & {}

class EditClient extends React.Component<Props> {
    componentDidMount(): void {
        if (this.props.match?.params) {
            this.props.loadClient(this.props.match?.params.id)
        }
    }

    public render() {
        return (
            <FileContainer>
                <Title name="Edit Client"/>
                <Loader loading={this.props.base.loadingStatusEnabled}>
                    {/*<ModifyClient*/}
                    {/*    client={this.props.client.workingClient}*/}
                    {/*    cancelAction={() => window.location.href = '/client/' + this.props.match?.params.id}*/}
                    {/*/>*/}
                </Loader>
            </FileContainer>
        )
    }
}

export default withRouter(connector(EditClient))