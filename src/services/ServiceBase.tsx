import Credentials from "../data/Credentials";
import {setBaseCredentials} from "../actions/Base";
import {AsyncAction} from "../actions/Async";

export default class ServiceBase {
    static jsonNoAuthenticationHeader = {'Content-Type': 'application/json'};
    static authenticationHeader = {'Authorization': 'Bearer ' + new Credentials().jwt}
    static jsonHeader = Object.assign(
        {},
        ServiceBase.jsonNoAuthenticationHeader,
        ServiceBase.authenticationHeader
    );
}

export const LoadCredentials = (): AsyncAction => {
    return (dispatch) => {
        dispatch(setBaseCredentials(new Credentials()))
    }
}