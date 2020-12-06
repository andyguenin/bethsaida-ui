import {AsyncAction} from "../actions/Async";
import Env from "../environment/Env";
import ServiceBase from "./ServiceBase";
import {setErrorMessage} from "../actions/Base";
import Client from "../data/Client";
import User from "../data/User";
import MailRecord from "../data/MailRecord";

function parseMail(l: any, clients: Client[], users: User[]): MailRecord {
    const client = clients.find(c => c.id === l['clientId'])
    const user = users.find(u => u.id === l['inputUser'])

    if(client === undefined) {
        throw new Error("cannot find a matching client")
    }
    if(user === undefined) {
        throw new Error("cannot find a matching employee")
    }

    return new MailRecord(l['id'], client, user, new Date(l['startDate']))

}


export const GetAllMailRecords = (update: (r: MailRecord[]) => void, clients: Client[], users: User[]): AsyncAction => {
    return (dispatch) => {
        fetch(Env.get().fullUrl() + '/mail/', {
            method: 'GET',
            headers: ServiceBase.authenticationHeader
        }).then(
            resp => {
                if(resp.ok) {
                    resp.json().then(
                        json =>
                            update((json as []).map(r => parseMail(r, clients, users)))
                    )
                } else {
                    dispatch(setErrorMessage("could not fetch mail information"))
                }
            }
        )
    }
}

export const PutMailRecord = (rec: MailRecord, action: () => void): AsyncAction => {
    return (dispatch) => {
        const mailRequest: any = {
            inputUser: rec.onboardUser.id,
            clientId: rec.client.id,
            startDate: rec.onboardDate
        }
        fetch(Env.get().fullUrl() + '/mail/', {
            method: 'POST',
            headers: ServiceBase.jsonHeader,
            body: JSON.stringify(mailRequest)
        }).then(
            resp => {
                if(resp.ok) {
                    resp.json().then(
                        json => action()
                    )
                }
            }
        )
    }
}

export const EndMailAssignment = (id: String, date: Date, action: () => void): AsyncAction => {
    return (dispatch) => {
        fetch(Env.get().fullUrl() + '/mail/' + id, {
            method: 'POST',
            headers: ServiceBase.jsonHeader,
            body: JSON.stringify({date})
        }).then(
            resp => {
                if(resp.ok) {
                    resp.json().then(
                        json => action()
                    )
                }
            }
        )
    }
}
