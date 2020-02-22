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



export type ClientAction = SetClientsData