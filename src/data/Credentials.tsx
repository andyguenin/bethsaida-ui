import Cookies from 'universal-cookie';

export default class LoginCredentials {
    get jwt(): string | undefined {
        return this._jwt;
    }

    set jwt(value: string | undefined) {
        this._jwt = value;
    }

    get expires(): Date | undefined {
        return this._expires;
    }

    set expires(value: Date | undefined ) {
        this._expires = value;
    }

    public isLoggedIn() {
        return this.expires !== undefined && this.expires.getMilliseconds() > new Date().getMilliseconds();
    }

    constructor() {
        this.cookies = new Cookies();
        this._jwt = this.cookies.get('jwt');
        this._expires = this.cookies.get('expires')
    }

    private cookies: Cookies;
    private _jwt?: string;
    private _expires?: Date;

}