import Service from "../data/Service";

export const SERVICE_SETDATA = "service/setdata"
export type SERVICE_SETDATA = typeof SERVICE_SETDATA;

export interface SetServiceData {
    type: SERVICE_SETDATA,
    data: Service[]
}

export function setServiceData(s: Service[]): SetServiceData {
    return {
        type: SERVICE_SETDATA,
        data: s
    }
}

export type ServiceAction = SetServiceData