import Credentials from "../data/Credentials";
import Env from "../environment/Env";

export enum RequestType {
    POST,
    GET
}

const reqTypeMapping = (r: RequestType) => {
    switch (r) {
        case RequestType.GET:
            return 'get';
        case RequestType.POST:
            return 'post';
    }

}

export const apiRequest = (
    path: string,
    requestType: RequestType,
    handler: (xml: XMLHttpRequest) => void,
    data?: object
): void => {
    const cred = new Credentials();
    const xhr = new XMLHttpRequest();
    xhr.open(reqTypeMapping(requestType), Env.get().fullUrl() + path, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    if(cred.isLoggedIn()) {
        xhr.setRequestHeader("Authorization", "Bearer " + cred.jwt);
    }
    xhr.onreadystatechange = () => {
        if(xhr.status === 401) {
            window.location.href = '/';
        }
        handler(xhr);
    }
    if(data !== undefined) {
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }

}