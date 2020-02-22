import Cookies from 'universal-cookie';

export default class Credentials {
    public static setCredentials(auth: string) {
        const cookie = new Cookies();
        cookie.set('jwt', auth, {'path': '/'});
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 3);
        cookie.set('expires', currentDate, {'path': '/'});
    }

    public static clearCredentials() {
        const cookie = new Cookies();
        cookie.set('jwt', undefined, {'path': '/'});
        cookie.set('expires', undefined, {'path': '/'});
    }

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
    }

    private cookies: Cookies;
    private _jwt?: string;
    private _expires?: Date;

}