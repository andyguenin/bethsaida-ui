import {AsyncAction} from "../actions/Async";
import Env from "../environment/Env";
import ServiceBase from "./ServiceBase";
import BethsaidaEvent from "../data/BethsaidaEvent";
import EventBuilder from "../data/BethsaidaEventBuilder";

function parseEvent(input: any): BethsaidaEvent {
    const event = new BethsaidaEvent(
        input['id'],
        input['serviceId'],
        input['capacity'],
        input['date']
    );
    return event;
}


export const LoadAllEvents = (update: (c: BethsaidaEvent[]) => void): AsyncAction => {
    return (dispatch) => {
        fetch(Env.get().fullUrl() + '/event/', {
            method: 'GET',
            headers: ServiceBase.authenticationHeader
        }).then(
            r => r.json().then(
                json => {
                    const ar = (json as [])
                    if(ar.length != 0) {
                        update(ar.map(parseEvent));
                    } else {
                        update([]);
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
                    const client = parseEvent(json)
                    action(client);
                }
            )
        )
    }
}

export const NewEventRequest = (builder: EventBuilder, successAction: (id: string) => void): AsyncAction =>
    (dispatch) => {
        fetch(Env.get().fullUrl() + '/event/new', {
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
                        // window.location.href='/';
                    }
                }
            )
        )
    };

export const UpdateEvent = (
    eventBuilder: EventBuilder,
    successAction: (id: string) => void,
    failureAction: (message: string) => void
): AsyncAction => {
    return (dispatch) => {
        if(eventBuilder.id === undefined) {
            failureAction('BethsaidaEvent id is not set')
        } else {
            fetch(Env.get().fullUrl() + '/event/' + eventBuilder.id + '/update', {
                method: 'POST',
                headers: ServiceBase.jsonHeader,
                body: JSON.stringify(eventBuilder.build())
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