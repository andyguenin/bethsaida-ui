import Client from "../data/Client";
import {
    CLIENT_REMOVE,
    CLIENT_SETDATA,
    ClientAction
} from "../actions/Client";


export interface ClientState {
    clients: Client[]
    clientFilterFunction: (searchString: string, clients: Client[]) => Client[]
    clientSortFunction: (clients: Client[]) => Client[]
}

const sortFunc = (clients: Client[]): Client[] => {
    return clients.sort((c1, c2) => {
        const lastName = c1.lastName.localeCompare(c2.lastName)
        if (lastName !== 0) {
            return lastName;
        }
        const firstName = c1.firstName.localeCompare(c2.firstName);
        if (firstName !== 0) {
            return firstName;
        }
        const c1m = c1.middleName || '';
        const c2m = c2.middleName || '';
        return c1m.localeCompare(c2m);
    })

}

const filterFunc = (searchString: string, c: Client[]): Client[] => {
    const newFilter =
        '.*' + searchString.toLowerCase().split(' ').reduce((l, c) => {
            return (l + '.*' + c)
        }) + '.*';
    const regex = RegExp(newFilter);
    return c.filter((c) => c.fullName.toLowerCase().match(regex));
}

export const initialClientState: ClientState = {
    clients: [],
    clientFilterFunction: filterFunc,
    clientSortFunction: sortFunc
}

export function clientReducer(state: ClientState = initialClientState, action: ClientAction) {
    switch (action.type) {
        case CLIENT_SETDATA:
            return Object.assign({}, state, {clients: action.data});
        case CLIENT_REMOVE:
            return Object.assign({}, state, {
                clients: state.clients.filter((c) => {
                    return c.id !== action.id;
                })
            })
        default:
            return state;
    }
}

