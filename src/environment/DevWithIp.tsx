import Environment from "./Environment";

export default class DevWithIp extends Environment {
    host: string = 'http://192.168.0.34:8090';
    apiPath: string = '/api/v1';
    // imageUrl = 'https://downtowndailybread-client-photo.s3.us-east-2.amazonaws.com';
    imageUrl = 'http://192.168.0.34:3001'
}