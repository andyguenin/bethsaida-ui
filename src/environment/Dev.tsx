import Environment from "./Environment";

export default class Dev extends Environment {
    // ip: string = '192.168.0.182'
    // ip: string = 'localhost';
    ip = '192.168.1.163'
    host: string = 'http://' + this.ip + ':8090';
    apiPath: string = '/api/v1';
    imageUrl = 'https://downtowndailybread-client-photo.s3.us-east-2.amazonaws.com';
    // imageUrl = 'http:/' + this.ip + ':3001';
}