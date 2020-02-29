import {ServiceType} from "./ServiceType";

export default class Service {
    public readonly id: string;
    public readonly name: string;
    public readonly serviceType: ServiceType;
    public readonly defaultCapacity?: number;

    constructor(id: string, name: string, serviceType: ServiceType, defaultCapacity?: number) {
        this.id = id;
        this.name = name;
        this.serviceType = serviceType;
        this.defaultCapacity = defaultCapacity;
    }


}