

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


export type BaseAction = BaseErrorMessage