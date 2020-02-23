export default abstract class Environment {
    abstract host: string;
    abstract apiPath: string;
    protected isProd: boolean = false;


    public fullUrl(): string{
        return this.host + this.apiPath;
    }

    public getAuthenticationUrl(): string {
        return this.fullUrl() + '/authenticate';
    }

    public getUserConfirmUrl(): string {
        return this.getAuthenticationUrl() + '/confirm';
    }

    public isNonProd(): boolean {
        return !this.isProd;
    }
}