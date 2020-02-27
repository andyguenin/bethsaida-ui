import Environment from "./Environment";

export default class Edge extends Environment {
    host: string = 'http://edge.api.bethsaida.downtowndailybread.org';
    apiPath: string = '/api/v1';
    isProd: boolean = false;
    imageUrl = 'https://downtowndailybread-client-photo.s3.us-east-2.amazonaws.com';
}