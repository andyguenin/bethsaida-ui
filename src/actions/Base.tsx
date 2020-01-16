

export const BASE_LOADING_STATUS = "base/loadingstatus"
export type BASE_LOADING_STATUS = typeof BASE_LOADING_STATUS

export interface BaseLoadingStatus {
    type: BASE_LOADING_STATUS
    loadingStatusEnabled: boolean
}

export function toggleLoadingStatus(statusEnabled: boolean): BaseLoadingStatus {
    return {
    type: BASE_LOADING_STATUS,
    loadingStatusEnabled: statusEnabled
}}


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


export type BaseAction = BaseLoadingStatus | BaseErrorMessage