export default class Attendance {
    readonly id: string;
    readonly checkinTime: Date;
    readonly clientId: string;
    readonly eventId: string;
    readonly userId: string;

    constructor(id: string, checkinTime: Date, clientId: string, eventId: string, userId: string) {
        this.id = id;
        this.checkinTime = checkinTime;
        this.clientId = clientId;
        this.eventId = eventId;
        this.userId = userId;
    }
}