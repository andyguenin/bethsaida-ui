export default class User {

    public readonly name: string;
    public readonly email: string;
    public readonly password?: string;
    public readonly admin: boolean;
    public readonly createTime: Date;
    public readonly latestActivity: Date;
    public readonly confirmed: boolean;
    public readonly adminLock: boolean;
    public readonly userLock: boolean;
    public readonly id?: string;


    constructor(name: string, email: string, admin: boolean, createTime: Date, latestActivity: Date,
                confirmed: boolean, adminLock: boolean, userLock: boolean, password?: string, id?: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.admin = admin;
        this.createTime = createTime;
        this.latestActivity = latestActivity;
        this.confirmed = confirmed;
        this.adminLock = adminLock;
        this.userLock = userLock;
    }
}