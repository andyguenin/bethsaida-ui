import Credentials from "../data/Credentials";

export default class ServiceBase {
    static jsonNoAuthenticationHeader = {'Content-Type': 'application/json'};
    static authenticationHeader = {'Authorization': 'Bearer ' + new Credentials().jwt}
    static jsonHeader = Object.assign(
        {},
        ServiceBase.jsonNoAuthenticationHeader,
        ServiceBase.authenticationHeader
    );
}