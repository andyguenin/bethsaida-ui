import Environment from "./Environment";

export default class Prod extends Environment {
    host: string = 'https://api.bethsaida.downtowndailybread.org';
    apiPath: string = '/api/v1';
    isProd: boolean = true;
    imageUrl = 'https://downtowndailybread-client-photo.s3.us-east-2.amazonaws.com';

}