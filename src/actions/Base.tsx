import Credentials from "../data/Credentials";


export const BASE_ERROR_MESSAGE = "base/errorstatus"
export type BASE_ERROR_MESSAGE = typeof BASE_ERROR_MESSAGE

export interface BaseErrorMessage {
    type: BASE_ERROR_MESSAGE,
    enabled: boolean,
    message: string

}

export function setErrorMessage(m: string): BaseErrorMessage {
    return {
        type: BASE_ERROR_MESSAGE,
        enabled: true,
        message: m
    }
}

export function clearErrorMessage(): BaseErrorMessage {
    return {
        type: BASE_ERROR_MESSAGE,
        enabled: false,
        message: ''
    }
}





export const BASE_CREDENTIALS = "base/creds"
export type BASE_CREDENTIALS = typeof BASE_CREDENTIALS

export interface BaseCredentials {
    type: BASE_CREDENTIALS,
    credentials: Credentials

}

export function setBaseCredentials(m: Credentials): BaseCredentials {
    return {
        type: BASE_CREDENTIALS,
        credentials: m
    }
}


export type BaseAction = BaseErrorMessage | BaseCredentials