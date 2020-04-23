import Client from "./Client";
import User from "./User";

export default class MailRecord {
    public readonly id: string;
    public readonly client: Client;
    public readonly onboardUser: User;
    public readonly onboardDate: Date;


    constructor(id: string, client: Client, user: User, onboardDate: Date) {
        this.id = id;
        this.client = client;
        this.onboardUser = user;
        this.onboardDate = onboardDate
    }

}