import Environment from "./Environment";

export default class Dev extends Environment {
    host: string = 'http://localhost:8090';
    apiPath: string = '/api/v1';

}