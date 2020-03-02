import Client from "../data/Client";


export const CLIENT_SETDATA = "client/setdata"
export type CLIENT_SETDATA = typeof CLIENT_SETDATA

export interface SetClientsData {
    type: CLIENT_SETDATA,
    data: Client[]
}

export function setClientData(d: Client[]): SetClientsData { return {
    type: CLIENT_SETDATA,
    data: d
}}

export const CLIENT_REMOVE = "client/remove"
export type CLIENT_REMOVE = typeof CLIENT_REMOVE

export interface RemoveClient {
    type: CLIENT_REMOVE,
    id: string
}

export function removeClient(id: string): RemoveClient {
    return {
        type: CLIENT_REMOVE,
        id: id
    }
}

export type ClientAction = SetClientsData | RemoveClient