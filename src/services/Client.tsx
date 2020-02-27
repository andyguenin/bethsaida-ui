import {toggleLoadingStatus} from "../actions/Base";
import {AsyncAction} from "../actions/Async";
import Client from "../data/Client";
import BDate from "../data/BDate";
import {setClientData} from "../actions/Client";
import {apiRequest, RequestType} from "../util/HttpRequest";
import ClientBuilder from "../data/ClientBuilder";
import Env from "../environment/Env";

function parseClient(input: any): Client {
    return new Client(
        input['firstName'],
        input['lastName'],
        new BDate(
            input['dateOfBirth']['year'],
            input['dateOfBirth']['month'],
            input['dateOfBirth']['day']
        ),
        input['race'],
        input['gender'],
        new BDate(
            input['intakeDate']['year'],
            input['intakeDate']['month'],
            input['intakeDate']['day']
        ),
        input['nicknames'],
        input['id'],
        input['middleName'],
        input['clientPhoto'],
        input['photoId'],
        input['phone']
    )
}


export const GetAllClients = (): AsyncAction =>
    (dispatch, state, x) => {
        dispatch(toggleLoadingStatus(true));
        apiRequest('/client', RequestType.GET, (xhr: XMLHttpRequest) => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                const result = JSON.parse(xhr.responseText);
                if ((result as []).length !== 0) {
                    const data = result.map(parseClient);
                    dispatch(setClientData(data));
                }
                dispatch(toggleLoadingStatus(false));
            }
        });
    };


// export const GetSingleClient = (id: string): AsyncAction =>
//     (dispatch, state, x) => {
//         dispatch(toggleLoadingStatus(true));
//         // axios.get('http://localhost:8090/api/v1/client/' + id).then(
//         //     result => {
//         //         const data = parseClient(result.data);
//         //         dispatch(setWorkingClient(data));
//         //         dispatch(toggleLoadingStatus(false));
//         //     }
//         // )
//     };

export const GetSingleClient = (id: string, action: (c: Client) => void): AsyncAction => {
    return (dispatch) => {
        apiRequest('/client/' + id, RequestType.GET, (xhr) => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if(xhr.status === 200) {
                    const result = JSON.parse(xhr.responseText);
                    const client = parseClient(result);
                    action(client)
                }
            }
        })
    }
}

export const NewClientRequest = (clientBuilder: ClientBuilder): AsyncAction =>
    (dispatch) => {
    apiRequest('/client/new', RequestType.POST, (xhr: XMLHttpRequest) => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.responseText)
            const result = JSON.parse(xhr.responseText);
        }
    }, clientBuilder.build())
        // fetch(Env.get().fullUrl() + '/client/new', {
        //     method: 'POST',
        //     body: clientBuilder.build().toString()
        // })
    }