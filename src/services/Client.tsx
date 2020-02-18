import {toggleLoadingStatus} from "../actions/Base";
import {AsyncAction} from "../actions/Async";
import Client from "../data/Client";
import BDate from "../data/BDate";
import {setClientData, setWorkingClient} from "../actions/Client";
import axios from 'axios';


function parseClient(input: any): Client {
    return new Client(
        input['id'],
        input['firstName'],
        input['middleName'],
        input['lastName'],
        input['clientPhoto'],
        input['photoId'],
        input['phone'],
        input['nicknames'],
        new BDate(
            input['dateOfBirth']['year'],
            input['dateOfBirth']['month'],
            input['dateOfBirth']['day']
        )
    )
}


export const GetAllClients = (): AsyncAction =>
    (dispatch, state, x) => {
        dispatch(toggleLoadingStatus(true));
        axios.get('http://localhost:8090/api/v1/client').then(
            result => {
                const data = result.data.map(parseClient)
                dispatch(setClientData(data));
                dispatch(toggleLoadingStatus(false))
            }
        )
    };


export const GetSingleClient = (id: string): AsyncAction =>
    (dispatch, state, x) => {
        dispatch(toggleLoadingStatus(true));
        axios.get('http://localhost:8090/api/v1/client/' + id).then(
            result => {
                const data = parseClient(result.data);
                dispatch(setWorkingClient(data));
                dispatch(toggleLoadingStatus(false));
            }
        )
    };

