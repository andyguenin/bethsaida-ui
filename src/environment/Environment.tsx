export default abstract class Environment {
    abstract host: string;
    abstract apiPath: string;

    public fullUrl(): string{
        return this.host + this.apiPath;
    }

    public getAuthenticationUrl(): string {
        return this.fullUrl() + '/authenticate';
    }

    public getUserConfirmUrl(): string {
        return this.getAuthenticationUrl() + '/confirm';
    }
}