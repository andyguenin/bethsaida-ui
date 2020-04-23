import {AsyncAction} from "../actions/Async";
import Env from "../environment/Env";
import ServiceBase from "./ServiceBase";
import BethsaidaEvent from "../data/BethsaidaEvent";
import Locker from "../data/Locker";
import {setErrorMessage} from "../actions/Base";
import Client from "../data/Client";
import User from "../data/User";

function parseLocker(l: any, clients: Client[], users: User[]): Locker {
    const client = clients.find(c => c.id === l['clientId'])
    const user = users.find(u => u.id === l['inputUser'])

    if(client === undefined) {
        throw new Error("cannot find a matching client")
    }
    if(user === undefined) {
        throw new Error("cannot find a matching employee")
    }

    const startDate = new Date(l['startDate'])
    const expectedEndDate = new Date(l['expectedEndDate'])
    const endDate = new Date(l['endDate'])
    return new Locker(
        l['id'],
        client,
        l['lockerNumber'],
        startDate,
        expectedEndDate,
        user,
        endDate
    )

}


export const GetAllLockers = (update: (c: Locker[]) => void, clients: Client[], users: User[]): AsyncAction => {
    return (dispatch) => {
        fetch(Env.get().fullUrl() + '/locker/', {
            method: 'GET',
            headers: ServiceBase.authenticationHeader
        }).then(
            resp => {
                if(resp.ok) {
                    resp.json().then(
                        json =>
                            update((json as []).map(r => parseLocker(r, clients, users)))
                    )
                } else {
                    dispatch(setErrorMessage("could not fetch locker information"))
                }
            }
        )
    }
}

export const PutLocker = (locker: Locker, action: () => void): AsyncAction => {
    return (dispatch) => {
        const lockerRequest: any = {
            lockerNumber: locker.lockerNumber.toString(),
            clientId: locker.client.id,
            startDate: locker.startDate,
            endDate: locker.endDate,
            expectedEndDate: locker.expectedEndDate,
            inputUser: locker.inputUser.id
        }
        fetch(Env.get().fullUrl() + '/locker/', {
            method: 'POST',
            headers: ServiceBase.jsonHeader,
            body: JSON.stringify(lockerRequest)
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

export const EndLockerAssignment = (id: String, date: Date, action: () => void): AsyncAction => {
    return (dispatch) => {
        fetch(Env.get().fullUrl() + '/locker/' + id, {
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
