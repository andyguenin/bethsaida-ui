import Environment from "./Environment";
import Dev from "./Dev";
import Prod from "./Prod";

export default class Env {

    private static env?: Environment;

    public static get(): Environment {
        if(this.env === undefined) {
            this.env = this.loadEnvironment();
            console.log(process.env['REACT_APP_ENV'] || 'default')
        }
        return this.env;
    }


    private static loadEnvironment(): Environment {
        const envName = process.env['REACT_APP_ENV'] || 'default';
        switch (envName) {
            case 'prod':
                return new Prod();
            case 'dev':
                return new Dev();
            case 'default':
            default:
                console.log(window.location.host);
                if (window.location.host !== 'bethsaida.downtowndailybread.org') {
                    return new Dev();
                } else {
                    return new Prod();
                }
        }
    }
}
