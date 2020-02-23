import Environment from "./Environment";

export default class Prod extends Environment {
    host: string = 'http://api.bethsaida.downtowndailybread.org';
    apiPath: string = '/api/v1';
    isProd: boolean = true

}