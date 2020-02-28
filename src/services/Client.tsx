import {toggleLoadingStatus} from "../actions/Base";
import {AsyncAction} from "../actions/Async";
import Client from "../data/Client";
import BDate from "../data/BDate";
import {setClientData} from "../actions/Client";
import ClientBuilder from "../data/ClientBuilder";
import Env from "../environment/Env";
import ServiceBase from "./ServiceBase";

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
        input['phone'],
        (input['intakeUser'] !== undefined ? input['intakeUser']['name'] : undefined)
    )
}


export const GetAllClients = (updateFunc: (clients: Client[]) => void): AsyncAction =>
    (dispatch, state, x) => {
        dispatch(toggleLoadingStatus(true));
        fetch(Env.get().fullUrl() + '/client', {
            method: 'GET',
            headers: ServiceBase.authenticationHeader
        })
            .then(
                r => r.json().then(
                    json => {
                        if ((json as []).length !== 0) {
                            const data = json.map(parseClient);
                            dispatch(setClientData(data));
                            updateFunc(data);
                        }
                        dispatch(toggleLoadingStatus(false))
                    }
                )
            )
    };


export const GetSingleClient = (id: string, action: (c: Client) => void): AsyncAction => {
    return (dispatch) => {
        fetch(Env.get().fullUrl() + '/client/' + id, {
            method: 'GET',
            headers: ServiceBase.authenticationHeader
        }).then(
            r => r.json().then(
                json => {
                    const client = parseClient(json)
                    action(client);
                }
            )
        )
    }
}

export const UpdateClient = (
    clientBuilder: ClientBuilder,
    successAction: (id: string) => void,
    failureAction: (message: string) => void
    ): AsyncAction => {
    return (dispatch) => {
        if(clientBuilder.id === undefined) {
            failureAction('Client id is not set')
        } else {
            fetch(Env.get().fullUrl() + '/client/' + clientBuilder.id + '/update', {
                method: 'POST',
                headers: ServiceBase.jsonHeader,
                body: JSON.stringify(clientBuilder.build())
            }).then(
                resp => resp.json().then(
                    json => {
                        if(resp.ok) {
                            const id = json['id'];
                            successAction(id);
                        } else {
                            const error = json['message'];
                            failureAction(error);
                        }
                    }
                )
            )
        }

    }
}

export const NewClientRequest = (clientBuilder: ClientBuilder, successAction: (id: string) => void): AsyncAction =>
    (dispatch) => {
        fetch(Env.get().fullUrl() + '/client/new', {
            method: 'POST',
            headers: ServiceBase.jsonHeader,
            body: JSON.stringify(clientBuilder.build())
        }).then(
            resp => resp.json().then(
                json => {
                    if(resp.ok) {
                        const id = json['id'];
                        successAction(id);
                    } else {
                        window.location.href='/';
                    }
                }
            )
        )
    }


export const UploadImage = (file: File, success: (imageName: string) => void, errorHandler: (message: string) => void): void => {
    const formData = new FormData();
    formData.append('fileUpload', file);
    fetch(Env.get().fullUrl() + '/client/imageupload', {
        method: 'POST',
        headers: ServiceBase.authenticationHeader,
        body: formData
    }).then(
        r => r.json().then(
            json => {
                if(r.ok) {
                    const image = json['image'];
                    success(image);
                } else {
                    const error = json['message'];
                    errorHandler(error);
                }
            }
        )
    )
}