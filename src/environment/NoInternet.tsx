import Environment from "./Environment";

export default class NoInternet extends Environment {
    host: string = 'http://localhost:8090';
    apiPath: string = '/api/v1';
    imageUrl = 'http://localhost:1448';

}