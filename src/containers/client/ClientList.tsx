import React, {Fragment} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AppState} from "../../reducers/AppState";
import Client from "../../data/Client";
import {Loader} from "../../components/app/loader/Loader"
import axios from 'axios'
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {ClientAction, setClientData} from "../../actions/Client";
import {toggleLoadingStatus} from "../../actions/Base";
import {AllAction} from "../../actions/Actions";
import BDate from "../../data/Date";
import './Client.scss';


const mapStateToProps = (state: AppState) => ({
    client: state.client,
    base: state.base
})

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, void, AllAction>) => {
    return {
        toggle: () => dispatch(beginLoadEndLoad()),
        toggle2: () => dispatch(toggleLoadingStatus(true))
    }
}

export const beginLoadEndLoad = (): ThunkAction<void, AppState, void, AllAction> =>
    (dispatch, state, x) => {
        dispatch(toggleLoadingStatus(true));
        axios.get('http://localhost:8090/api/v1/client').then(
            result => {
                const data = result.data.map((d: any) => {
                    return new Client(
                        d['firstName'],
                        d['lastName'],
                        d['photoIdTag'],
                        d['nicknames'],
                        new BDate(
                            d['year'],
                            d['month'],
                            d['day']
                        )
                    )
                })
                dispatch(setClientData(data));
                dispatch(toggleLoadingStatus(false))
            }
        )
    }

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
)
type PropsFromRedux = ConnectedProps<typeof connector>

// if we want to add in other props required for the tag that aren't part of the state
type Props = PropsFromRedux & {
}


class ClientPage extends React.Component<Props> {

    public render() {
        return (
            <Fragment>
                <h1>Clients</h1>
                <button onClick={this.props.toggle}>Toggle</button>
                <Loader loading={this.props.base.loadingStatusEnabled} />
                <div className={'row ' + (this.props.base.loadingStatusEnabled ? 'nowshow' : '')}>
                    <div className='col-md-12'>
                        <table className="table client-table">
                            <thead>
                            <tr>
                                <th> </th>
                                <th>Name</th>
                            </tr>
                            {this.props.client.clients.map(c => this.singleRow(c))}
                            </thead>
                        </table>
                    </div>
                </div>
            </Fragment>
        );
    }

    private singleRow(client: Client) {
        return (
            <tr key={client.fullName}>
                <td className='bethsaida-thumbnail'><img src={client.image}/></td>
                <td>{client.fullName}</td>
            </tr>
        )
    }
}


export default connector(ClientPage)