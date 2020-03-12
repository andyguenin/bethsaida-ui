import {AsyncAction} from "../actions/Async";
import Env from "../environment/Env";
import ServiceBase from "./ServiceBase";
import {setErrorMessage} from "../actions/Base";


export const GetNote = (id: string, action: (note: string) => void): AsyncAction =>
    (dispatch) => {
        fetch(Env.get().fullUrl() + '/note/' + id, {
            method: 'GET',
            headers: ServiceBase.authenticationHeader
        }).then(
            r => r.json().then(
                data => {
                    if(r.ok) {
                        action(data['note'])
                    } else {
                        dispatch(setErrorMessage(data['message']))
                    }
                }
            )
        )
    }

export const SetNote = (id: String, note: string, action: (note: string) => void): AsyncAction =>
    (dispatch) => {
        fetch(Env.get().fullUrl() + '/note/' + id, {
            method: 'POST',
            headers: ServiceBase.jsonHeader,
            body: JSON.stringify({
                note
            })
        }).then(
            r => r.json().then(
                data => {
                    if(r.ok) {
                        action(data['note'])
                    } else {
                        dispatch(setErrorMessage(data['message']))
                    }
                }
            )
        )
    }