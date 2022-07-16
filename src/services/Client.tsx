import {AsyncAction} from "../actions/Async";
import Client, {createExtraParameters} from "../data/Client";
import BDate from "../data/BDate";
import {removeClient, setClientData} from "../actions/Client";
import ClientBuilder from "../data/ClientBuilder";
import Env from "../environment/Env";
import ServiceBase from "./ServiceBase";
import {clearErrorMessage, setErrorMessage} from "../actions/Base";
import Ban from "../data/Ban";
import BanBuilder from "../data/BanBuilder";
import User from "../data/User";
import Attendance from "../data/Attendance";
import DateUtil from "../util/DateUtil";
import AttendanceData from "../data/AttendanceData";

function parseClient(users: User[]): (input: any) => Client {
    return (input) => {
        const user = users.find((u) => u.id === input['intakeUserId'])
        if (user !== undefined) {
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
                input['isBanned'] as boolean,
                user,
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
                input['raceSecondary'],
                input['hispanic'],
                input['banId'],
                input['caseworkerName'],
                input['caseworkerPhone'],
                input['last4Ssn'],
                input['veteran'],
                input['covidVaccine'],
                createExtraParameters(input['extraParameters'])

            )
        } else {
            throw Error("Could not find intake user id")
        }
    }
}

function parseBan(input: any): Ban {
    return new BanBuilder()
        .setUserId(input['userId'])
        .setClientId(input['clientId'])
        .setId(input['id'])
        .setNotes(input['notes'])
        .setType(input['banType'])
        .setActive(input['active'])
        .setStart(new Date(Date.parse(input['start'])))
        .setStop(new Date(input['stop']))
        .build()
}


export const DeleteClientBan = (clientId: string, action: () => void): AsyncAction =>
    (dispatch) => {
        fetch(Env.get().fullUrl() + '/client/' + clientId + '/ban/delete', {
            method: 'POST',
            headers: ServiceBase.authenticationHeader
        }).then(
            r => {
                if (r.ok) {
                    action()
                } else {
                    r.json().then(
                        data => dispatch(setErrorMessage(data['message']))
                    )
                }
            }
        )
    }

export const NewClientBan = (clientId: string, ban: Ban, action: (ban: Ban) => void): AsyncAction =>
    (dispatch) => {
        fetch(Env.get().fullUrl() + '/client/' + clientId + '/ban', {
            method: 'POST',
            headers: ServiceBase.jsonHeader,
            body: JSON.stringify(ban)
        }).then(
            r => r.json().then(
                data => {
                    if (r.ok) {
                        dispatch(clearErrorMessage());
                        action(ban);
                    } else {
                        dispatch(setErrorMessage(data['message']));
                    }
                }
            )
        )
    }
export const GetClientEvents = (clientId: String, updateFunc: (attendance: AttendanceData[]) => void): AsyncAction =>
    (dispatch) => {
        fetch(Env.get().fullUrl() + '/attendance/event/client/' + clientId, {
            method: 'GET',
            headers: ServiceBase.authenticationHeader
        }).then(
            r => {
                r.json().then(
                    json => {
                        if (r.ok) {
                            dispatch(clearErrorMessage())
                            let a = json.map((d: any) => {
                                return {
                                    name: d['eventName'],
                                    date: new BDate(
                                        d['eventDate']['year'],
                                        d['eventDate']['month'],
                                        d['eventDate']['day']).toDate()
                                }
                            })
                            updateFunc(a)
                        }
                    }
                )
            }
        )
    }

export const GetSingleClientBan = (clientId: string, updateFunc: (ban?: Ban) => void): AsyncAction =>
    (dispatch) => {
        fetch(Env.get().fullUrl() + '/client/' + clientId + '/ban', {
            method: 'GET',
            headers: ServiceBase.authenticationHeader
        }).then(
            r => {
                r.json().then(
                    json => {
                        if (r.ok) {
                            if (Object.keys(json).length === 0) {
                                updateFunc(undefined)
                            } else {
                                updateFunc(parseBan(json));
                            }
                        } else {
                            dispatch(setErrorMessage(json['message']))
                        }
                    }
                )
            }
        )
    }


export const GetAllClients = (updateFunc: (clients: Client[]) => void, users: User[]): AsyncAction =>
    (dispatch, state, x) => {
        fetch(Env.get().fullUrl() + '/client', {
            method: 'GET',
            headers: ServiceBase.authenticationHeader
        })
            .then(
                r => r.json().then(
                    json => {
                        if (r.ok) {
                            if ((json as []).length !== 0) {
                                const data = json.map(parseClient(users));
                                dispatch(setClientData(data));
                                updateFunc(data);
                            } else {
                                updateFunc([]);
                            }
                        } else {
                            dispatch(setErrorMessage(json['message']))
                        }
                    }
                )
            )
    };

export const DeleteImage = (imageTag: string, updateFunc: () => void): void => {
    fetch(Env.get().fullUrl() + '/client/deleteImage/' + imageTag, {
        method: 'GET',
        headers: ServiceBase.authenticationHeader
    })
        .then(r => updateFunc())
}


export const GetSingleClient = (id: string, action: (c: Client) => void, users: User[]): AsyncAction => {
    return (dispatch) => {
        fetch(Env.get().fullUrl() + '/client/' + id, {
            method: 'GET',
            headers: ServiceBase.authenticationHeader
        }).then(
            r => r.json().then(
                json => {
                    if (r.ok) {
                        const client = parseClient(users)(json)
                        action(client);
                    }
                }
            )
        )
    }
}

export const DeleteClient = (id: string, action: () => void): AsyncAction => {
    return (dispatch) => {
        fetch(Env.get().fullUrl() + '/client/' + id + '/delete', {
            method: 'POST',
            headers: ServiceBase.authenticationHeader
        }).then(
            () => {
                dispatch(removeClient(id));
                action()
            }
        )
    }
}

export const UpdateClient = (
    clientBuilder: ClientBuilder,
    successAction: (id: string) => void,
    failureAction: (message: string) => void
): AsyncAction => {
    return (dispatch) => {
        if (clientBuilder.id === undefined) {
            failureAction('Client id is not set')
        } else {
            fetch(Env.get().fullUrl() + '/client/' + clientBuilder.id + '/update', {
                method: 'POST',
                headers: ServiceBase.jsonHeader,
                body: JSON.stringify(clientBuilder.build().toJson())
            }).then(
                resp => resp.json().then(
                    json => {
                        if (resp.ok) {
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
            body: JSON.stringify(clientBuilder.build().toJson())
        }).then(
            resp => resp.json().then(
                json => {
                    if (resp.ok) {
                        const id = json['id'];
                        successAction(id);
                    } else {
                        dispatch(setErrorMessage(json['message']))
                    }
                }
            )
        )
    }

export const MergeClients = (fromClient: Client, toClient: Client, success: (id: string) => void): AsyncAction =>
    (dispatch) => {
        fetch(Env.get().fullUrl() + '/client/merge', {
            method: 'Post',
            headers: ServiceBase.jsonHeader,
            body: JSON.stringify({
                from: fromClient.id,
                to: toClient.id
            })
        }).then((r) => r.json())
            .then(r => {
                const id = r['id']
                success(id)
            })
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
                if (r.ok) {
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

