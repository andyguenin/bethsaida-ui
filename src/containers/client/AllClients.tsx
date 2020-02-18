import React, {Fragment} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AppState} from "../../reducers/AppState";
import {Loader} from "../../components/app/loader/Loader"
import './Client.scss';
import {AsyncDispatch} from "../../actions/Async";
import {GetAllClients} from "../../services/Client";
import {Title} from "../../components/app/Title";
import Client from "../../data/Client";
import FileContainer from "../../components/app/FileContainer";


const mapStateToProps = (state: AppState) => ({
    client: state.client,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        loadAllClients: () => dispatch(GetAllClients())
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
)
type PropsFromRedux = ConnectedProps<typeof connector>

// if we want to add in other props required for the tag that aren't part of the state
type Props = PropsFromRedux & {}


class AllClients extends React.Component<Props> {

    componentDidMount(): void {
        this.props.loadAllClients();
    }

    public render() {
        return (
            <FileContainer>
                <Title name='All Clients'/>
                <Loader loading={this.props.base.loadingStatusEnabled}>
                    <div className={'row ' + (this.props.base.loadingStatusEnabled ? 'nowshow' : '')}>
                        <div className='col-md-12'>
                            <table className="table table-striped client-table">
                                <thead className='thead-light'>
                                <tr>
                                    <th> </th>
                                    <th>Name</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.props.client.clients.map(c => this.singleRow(c))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Loader>
            </FileContainer>
        );
    }

    private singleRow(client: Client) {
        return (
                <tr className='clickable-row' key={client.fullName} onClick={() =>{window.location.href='/client/' + client.id}}>
                    <td className='bethsaida-thumbnail'><img src={client.clientPhoto} alt={'photo of ' + client.fullName}/></td>
                    <td>
                        <b>{client.fullName}</b>
                    </td>
                </tr>
        )
    }
}


export default connector(AllClients)