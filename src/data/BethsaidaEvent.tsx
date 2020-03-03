import BDate from "./BDate";

export default class BethsaidaEvent {
    public readonly id: string;
    public readonly serviceId: string;
    public readonly capacity: number;
    public readonly date: BDate;
    public readonly userCreatorId?: string;

    constructor(
        id: string,
        serviceId: string,
        capacity: number,
        date: BDate,
        userCreatorId?: string
    ) {
        this.id = id;
        this.serviceId = serviceId;
        this.capacity = capacity;
        this.date = date;
        this.userCreatorId = userCreatorId;
    }
}