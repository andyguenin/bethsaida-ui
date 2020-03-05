import Cookies from 'universal-cookie';

export default class Credentials {
    set displayAdmin(value: boolean) {
        this._displayAdmin = value;
    }

    public static setCredentials(auth: string, admin: boolean, id: string): Credentials {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 3);
        return new Credentials()
            .setJwt(auth)
            .setExpires(currentDate)
            .setAdmin(admin)
            .setDisplayAdmin(admin)
            .setId(id)
            .saveState();
    }

    public static clearCredentials() {
        new Credentials()
            .setAdmin(undefined)
            .setDisplayAdmin(undefined)
            .setExpires(undefined)
            .setJwt(undefined)
            .setId(undefined)
            .saveState()
    }

    public setJwt(jwt?: string): Credentials {
        this._jwt = jwt;
        return this;
    }

    public setExpires(date?: Date): Credentials {
        this._expires = date;
        return this;
    }

    public setAdmin(flag?: boolean): Credentials {
        this._admin = flag;
        return this;
    }

    public setDisplayAdmin(flag?: boolean): Credentials {
        this._displayAdmin = flag;
        return this;
    }

    get jwt(): string | undefined {
        return this._jwt;
    }
    get expires(): Date | undefined {
        return this._expires;
    }

    public getDisplayAdmin(): boolean {
        return this._displayAdmin || false;
    }

    public toggleDisplayAdmin(): Credentials {
        this._displayAdmin = !this._displayAdmin;
        return this.saveState()
    }

    public isAdmin(): boolean {
        return this._admin || false;
    }

    public setId(id?: string): Credentials {
        this._id = id;
        return this;
    }

    public getId(): string | undefined{
        return this._id;
    }

    public saveState(): Credentials {
        const cookie = new Cookies();
        cookie.set('jwt', this._jwt, {'path': '/'});
        cookie.set('expires', this._expires, {'path': '/'});
        cookie.set('admin', this._admin ? "true" : "false", {'path': '/'});
        cookie.set('displayAdmin', this._displayAdmin ? "true" : "false", {'path': '/'});
        cookie.set('id', this._id, {'path': '/'});
        return this;
    }

    public isLoggedIn() {
        if (this.expires !== undefined) {
            const timingValid = this.expires > new Date();
            if(!timingValid) {
                Credentials.clearCredentials();
            }
            return timingValid;
        } else {
            return false;
        }
    }

    constructor() {
        this.cookies = new Cookies();
        this._jwt = this.cookies.get('jwt');
        this._expires = new Date(this.cookies.get('expires'));
        this._displayAdmin = this.cookies.get("displayAdmin") === "true";
        this._admin = this.cookies.get("admin") === "true";
        this._id = this.cookies.get("id")
    }

    private cookies: Cookies;
    private _jwt?: string;
    private _expires?: Date;
    private _admin?: boolean;
    private _displayAdmin?: boolean;
    private _id?: string

}