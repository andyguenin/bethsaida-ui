import Credentials from "../data/Credentials";

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
    url: string,
    requestType: RequestType,
    handler: (xml: XMLHttpRequest) => void,
    data?: object
): void => {
    const cred = new Credentials();
    const xhr = new XMLHttpRequest();
    xhr.open(reqTypeMapping(requestType), url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    console.log(cred)
    if(cred.isLoggedIn()) {
        xhr.setRequestHeader("Authorization", "Bearer " + cred.jwt);
    }
    xhr.onreadystatechange = () => handler(xhr);
    if(data !== undefined) {
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }

}