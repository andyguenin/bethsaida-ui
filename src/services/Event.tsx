import {AsyncAction} from "../actions/Async";
import Env from "../environment/Env";
import ServiceBase from "./ServiceBase";
import BethsaidaEvent from "../data/BethsaidaEvent";
import EventBuilder from "../data/BethsaidaEventBuilder";
import BDate from "../data/BDate";
import {setErrorMessage} from "../actions/Base";
import {ServiceType} from "../data/ServiceType";
import {Race} from "../data/Race";

function parseEvent(input: any): BethsaidaEvent {
    const event = new BethsaidaEvent(
        input['id'],
        input['serviceId'],
        input['capacity'],
        new BDate(
            input['date']['year'],
            input['date']['month'],
            input['date']['day']
        ),
        input['createUserId']
    );
    return event;
}


export const GetAllEvents = (update: (c: BethsaidaEvent[]) => void, archive: boolean, serviceType: ServiceType): AsyncAction => {
    return (dispatch) => {
        const s = ServiceType[serviceType].toString().toLocaleLowerCase()
        fetch(Env.get().fullUrl() + '/event/' + (archive ? '' : 'active/') + s, {
            method: 'GET',
            headers: ServiceBase.authenticationHeader
        }).then(
            r => r.json().then(
                json => {
                    if(r.ok) {
                        const ar = (json as [])
                        if (ar.length != 0) {
                            update(ar.map(parseEvent));
                        } else {
                            update([]);
                        }
                    } else {
                        dispatch(setErrorMessage(json['message']))
                    }
                }
            )
        )
    }
}


export const GetSingleEvent = (id: string, action: (c: BethsaidaEvent) => void): AsyncAction => {
    return (dispatch) => {
        fetch(Env.get().fullUrl() + '/event/' + id, {
            method: 'GET',
            headers: ServiceBase.authenticationHeader
        }).then(
            r => r.json().then(
                json => {
                    if(r.ok) {
                        const client = parseEvent(json);
                        action(client);
                    } else {
                        dispatch(setErrorMessage(json['message']));
                    }
                }
            )
        )
    }
}

export const NewEvent = (builder: EventBuilder, successAction: (id: string) => void): AsyncAction =>
    (dispatch) => {
        fetch(Env.get().fullUrl() + '/event/new', {
            method: 'POST',
            headers: ServiceBase.jsonHeader,
            body: JSON.stringify(builder.build())
        }).then(
            resp => resp.json().then(
                json => {
                    if (resp.ok) {
                        const id = json['id'];
                        successAction(id);
                    } else {
                        if (resp.status === 400) {
                            dispatch(setErrorMessage(json['message']))
                        }
                    }
                }
            )
        )
    };

export const UpdateEvent = (
    eventBuilder: EventBuilder,
    successAction: (id: string) => void
): AsyncAction => {
    return (dispatch) => {
        if (eventBuilder.id === undefined) {
            dispatch(setErrorMessage('BethsaidaEvent id is not set'))
        } else {
            fetch(Env.get().fullUrl() + '/event/' + eventBuilder.id() + '/update', {
                method: 'POST',
                headers: ServiceBase.jsonHeader,
                body: JSON.stringify(eventBuilder.build())
            }).then(
                resp =>
                    resp.json().then(
                        json => {
                            if (resp.ok) {
                                const id = json['id'];
                                successAction(id);
                            } else {
                                const error = json['message'];
                                dispatch(setErrorMessage(error));
                            }
                        }
                    )
            )
        }
    }
};