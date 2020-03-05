import {AsyncAction} from "../actions/Async";
import Env from "../environment/Env";
import ServiceBase from "./ServiceBase";
import Service from "../data/Service";
import ServiceBuilder from "../data/ServiceBuilder";
import ClientBuilder from "../data/ClientBuilder";
import {setErrorMessage} from "../actions/Base";

function parseService(input: any): Service {
    const service = new Service(
        input['id'],
        input['name'],
        input['serviceType'],
        input['maxCapacity']
    );
    return service;
}


export const LoadAllServices = (update: (c: Service[]) => void): AsyncAction => {
    return (dispatch) => {
        LoadAllServices2(update, (s) => dispatch(setErrorMessage(s)));
    }
}

export const LoadAllServices2 = (update: (s: Service[]) => void, failure: (s: string) => void): void => {
    fetch(Env.get().fullUrl() + '/service', {
        method: 'GET',
        headers: ServiceBase.authenticationHeader
    }).then(
        r => r.json().then(
            json => {
                if(r.ok) {
                    const ar = (json as []);
                    if (ar.length !== 0) {
                        update(ar.map(parseService));
                    } else {
                        update([]);
                    }
                } else {
                    failure(json['message']);
                }
            }
        )
    )
}


export const GetSingleService = (id: string, action: (c: Service) => void): AsyncAction => {
    return (dispatch) => {
        fetch(Env.get().fullUrl() + '/service/' + id, {
            method: 'GET',
            headers: ServiceBase.authenticationHeader
        }).then(
            r => r.json().then(
                json => {
                    if(r.ok) {
                        const client = parseService(json)
                        action(client);
                    } else {
                        dispatch(setErrorMessage('Could not find service.'))
                    }
                }
            )
        )
    }
}

export const NewServiceRequest = (builder: ServiceBuilder, successAction: (id: string) => void): AsyncAction =>
    (dispatch) => {
        fetch(Env.get().fullUrl() + '/service/new', {
            method: 'POST',
            headers: ServiceBase.jsonHeader,
            body: JSON.stringify(builder.build())
        }).then(
            resp => resp.json().then(
                json => {
                    if(resp.ok) {
                        const id = json['id'];
                        successAction(id);
                    } else {
                        dispatch(setErrorMessage(json['message']));
                    }
                }
            )
        )
    };

export const UpdateService = (
    serviceBuilder: ServiceBuilder,
    successAction: (id: string) => void,
    failureAction: (message: string) => void
): AsyncAction => {
    return (dispatch) => {
        if(serviceBuilder.id === undefined) {
            failureAction('Service id is not set')
        } else {
            fetch(Env.get().fullUrl() + '/service/' + serviceBuilder.id() + '/update', {
                method: 'POST',
                headers: ServiceBase.jsonHeader,
                body: JSON.stringify(serviceBuilder.build())
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
};
export const DeleteService = (id: string, action: (id: string) => void) => {
    fetch(Env.get().fullUrl() + '/service/' + id + '/delete', {
        method: 'POST',
        headers: ServiceBase.jsonHeader
    }).then(
        resp => {
            if (resp.ok) {
                window.location.href = '/service'
            }
        }
    )
}