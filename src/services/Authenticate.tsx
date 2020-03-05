import {AsyncAction} from "../actions/Async";
import Env from "../environment/Env";
import Credentials from "../data/Credentials";
import ServiceBase from "./ServiceBase";

export const AuthenticateRequest = (
    email: string,
    password: string,
    complete: () => void,
    error: (message: string) => void
): void => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    fetch(Env.get().fullUrl() + '/authenticate', {
        method: 'POST',
        headers: ServiceBase.jsonNoAuthenticationHeader,
        body: JSON.stringify({
            email: email,
            password: password
        })
    }).then(
        r => {
            r.json().then(
                json => {
                    if (r.ok) {
                        const token = json['auth_token'];
                        Credentials.setCredentials(token, (json['admin'] as boolean), (json['id'] as string));
                        complete();
                    } else {
                        try {
                            const message = json['message']
                            error(message);
                        } catch {
                            error("Unexpected error. Please try again.")
                        }
                    }
                }
            )
        }
    )
}

// e.preventDefault();
// const fd = new FormData();
// fd.append("email", this.state.email)
// fd.append("password", this.state.password)
// apiRequest('/authenticate', RequestType.POST, (xhr: XMLHttpRequest) => {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             this.clearErrorMessage();
//             const response: any = JSON.parse(xhr.responseText);
//             if(response['auth_token'] !== undefined) {
//                 Credentials.setCredentials(response['auth_token']);
//                 this.props.history.push('/')
//             }
//             if (response['error'] === 'PasswordDoesNotMatch') {
//                 this.setErrorMessage('Password is not correct. Please try again.')
//             }
//             if (response['error'] === 'UserNotFound') {
//                 this.setErrorMessage('User not found. Please enter in a valid user.');
//             }
//             if (response['error'] === 'UserAccountNotConfirmed') {
//                 this.setErrorMessage('Please confirm your account via the link provided to you in an email.');
//             }
//         }
//     },
//     fd
// );