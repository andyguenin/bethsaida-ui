import Environment from "./Environment";
import Dev from "./Dev";
import Prod from "./Prod";

export default class Env {
    public static get(): Environment {
        const env = process.env['REACT_APP_ENV'] || 'dev';
        switch (env) {
            case 'prod':
                return new Prod();
            case 'dev':
            default:
                return new Dev();
        }
    }
}
