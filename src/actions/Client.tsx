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

export const CLIENT_SET_TEMP_CLIENT = "client/settempclient"
export type CLIENT_SET_TEMP_CLIENT = typeof CLIENT_SET_TEMP_CLIENT

export interface SetTemporaryClient {
    type: CLIENT_SET_TEMP_CLIENT,
    client: Client
}
export function setTemporaryClient(c: Client): SetTemporaryClient { return {
    type: CLIENT_SET_TEMP_CLIENT,
    client: c
}}

export const CLIENT_UNSET_TEMP_CLIENT = "client/unsettempclient"
export type CLIENT_UNSET_TEMP_CLIENT = typeof CLIENT_UNSET_TEMP_CLIENT

export interface UnsetTemporaryClient {
    type: CLIENT_UNSET_TEMP_CLIENT
}
export function unsetTemporaryClient(): UnsetTemporaryClient { return {
    type: CLIENT_UNSET_TEMP_CLIENT
}}


export const CLIENT_SET_WORKING_CLIENT = "client/setworkingclient"
export type CLIENT_SET_WORKING_CLIENT = typeof CLIENT_SET_WORKING_CLIENT

export interface SetWorkingClient {
    type: CLIENT_SET_WORKING_CLIENT,
    client: Client
}
export function setWorkingClient(c: Client): SetWorkingClient { return {
    type: CLIENT_SET_WORKING_CLIENT,
    client: c
}}

export const CLIENT_UNSET_WORKING_CLIENT = "client/unsetworkingclient"
export type CLIENT_UNSET_WORKING_CLIENT = typeof CLIENT_UNSET_WORKING_CLIENT

export interface UnsetWorkingClient {
    type: CLIENT_UNSET_WORKING_CLIENT
}
export function unsetWorkingClient(): UnsetWorkingClient { return {
    type: CLIENT_UNSET_WORKING_CLIENT
}}

export type ClientAction = SetClientsData | SetTemporaryClient | UnsetTemporaryClient | SetWorkingClient | UnsetWorkingClient