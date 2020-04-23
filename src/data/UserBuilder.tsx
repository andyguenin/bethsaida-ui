import User from "./User";

export default class UserBuilder {


    private _id?: string;
    private _firstName?: string;
    private _lastName?: string;
    private _email?: string;
    private _password?: string;
    private _admin?: boolean;
    private _createTime?: Date;
    private _latestActivity?: Date;
    private _confirmed?: boolean;
    private _adminLock?: boolean;
    private _userLock?: boolean;

    public setConfirmed(confirmed: boolean): UserBuilder {
        this._confirmed = confirmed;
        return this;
    }

    public getConfirmed(): boolean {
        return this._confirmed || false;
    }

    public setAdminLock(adminLock: boolean): UserBuilder {
        this._adminLock = adminLock
        return this;
    }

    public getAdminLock(): boolean {
        return this._adminLock || false;
    }

    public setUserLock(lock: boolean): UserBuilder {
        this._userLock = lock;
        return this;
    }

    public getUserLock(): boolean {
        return this._userLock || false;
    }

    public setId(id: string | undefined): UserBuilder {
        this._id = id;
        return this;
    }

    public getId(): string | undefined {
        return this._id;
    }

    public setFirstName(name: string | undefined): UserBuilder {
        this._firstName = name;
        return this;
    }

    public getFirstName(): string | undefined {
        return this._firstName;
    }

    public setLastName(name: string | undefined): UserBuilder {
        this._lastName = name;
        return this;
    }

    public getLastName(): string | undefined {
        return this._lastName;
    }

    public setEmail(email: string | undefined): UserBuilder {
        this._email = email;
        return this;
    }

    public getEmail(): string | undefined {
        return this._email;
    }

    public setPassword(password: string | undefined): UserBuilder {
        this._password = password;
        return this;
    }

    public getAdmin(): boolean {
        return this._admin || false;
    }

    public setAdmin(admin: boolean | undefined): UserBuilder {
        this._admin = admin;
        return this;
    }

    public setCreateTime(time: Date): UserBuilder {
        this._createTime = time;
        return this;
    }

    public getCreateTime(): Date | undefined {
        return this._createTime;
    }

    public setLatestActivity(time: Date): UserBuilder {
        this._latestActivity = time;
        return this;
    }

    public getLatestActivity(): Date | undefined {
        return this._latestActivity;
    }

    public getFullName(): string {
        return this._firstName + ' ' + this._lastName
    }

    public static load(user?: User): UserBuilder {
        if(user !== undefined) {
            return new UserBuilder()
                .setFirstName(user.firstName)
                .setLastName(user.lastName)
                .setId(user.id)
                .setEmail(user.email)
                .setAdmin(user.admin)
        } else {
            return this.emptyBuilder();
        }
    }

    public setField(field: string, value: string | undefined) {
        switch(field) {
            case 'id':
                return this.setId(value);
            case 'firstName':
                return this.setFirstName(value);
            case 'lastName':
                return this.setLastName(value);
            case 'email':
                return this.setEmail(value);
            case 'password':
                return this.setPassword(value);
            case 'admin':
                return this.setAdmin(value === 'true');
            default:
                throw new Error('no matching field');
        }
    }

    public build(): User {
        if(this._firstName === undefined || this._lastName === undefined || this._email === undefined ) {
            throw new Error('Cannot build user with missing attributes')
        } else {
            return new User(
                this._firstName,
                this._lastName,
                this._email,
                this._admin || false,
                this._createTime || new Date(),
                this._latestActivity || new Date(),
                this._confirmed || false,
                this._adminLock || false,
                this._userLock || false,
                this._password || '',
                this._id || '');
        }
    }

    public static emptyBuilder(): UserBuilder {
        return new UserBuilder()
            .setFirstName('')
            .setLastName('')
            .setId('')
            .setEmail('')
            .setPassword('')
            .setLatestActivity(new Date())
            .setCreateTime(new Date())
            .setAdmin(false)
            .setAdminLock(false)
            .setUserLock(false)
            .setConfirmed(false)

    }
}