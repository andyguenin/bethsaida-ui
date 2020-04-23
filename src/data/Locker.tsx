import Client from "./Client";
import User from "./User";

export default class Locker {

    public readonly id: string;
    public readonly client: Client;
    public readonly lockerNumber: number;
    public readonly startDate: Date;
    public readonly endDate?: Date;
    public readonly expectedEndDate: Date;
    public readonly inputUser: User;

    constructor(id: string, client: Client, lockerNumber: number, startDate: Date, expectedEndDate: Date, inputUser: User, endDate?: Date) {
        this.id = id;
        this.client = client;
        this.lockerNumber = lockerNumber;
        this.startDate = startDate;
        this.endDate = endDate;
        this.expectedEndDate = expectedEndDate;
        this.inputUser = inputUser;


    }

}