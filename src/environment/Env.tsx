import Environment from "./Environment";
import Dev from "./Dev";
import Prod from "./Prod";
import Edge from "./Edge";

export default class Env {

    private static env?: Environment;

    public static get(): Environment {
        if(this.env === undefined) {
            this.env = this.loadEnvironment();
        }
        return this.env;
    }


    private static loadEnvironment(): Environment {
        const envName = process.env['REACT_APP_ENV'] || 'default';
        switch (envName) {
            case 'prod':
                return new Prod();
            case 'edge':
                return new Edge();
            case 'dev':
                return new Dev();
            case 'default':
            default:
                if (window.location.host !== 'bethsaida.downtowndailybread.org') {
                    return new Edge();
                } else {
                    return new Prod();
                }
        }
    }
}
