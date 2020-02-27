export default abstract class Environment {
    abstract host: string;
    abstract apiPath: string;
    protected isProd: boolean = false;
    abstract imageUrl: string;


    public fullUrl(): string{
        return this.host + this.apiPath;
    }

    public isNonProd(): boolean {
        return !this.isProd;
    }
}