import {AsyncAction} from "../actions/Async";
import Env from "../environment/Env";
import ServiceBase from "./ServiceBase";
import User from "../data/User"
import {setErrorMessage} from "../actions/Base";

const parse = (data: any): User => {
    return new User(
        data['name'],
        data['email'],
        data['admin'],
        new Date(data['createTime']),
        new Date(data['latestActivity']),
        data['confirmed'],
        data['adminLock'],
        data['userLock'],
        data['password'],
        data['id']
    )
}

export const GetSingleUser = (id: string, success: (user: User) => void): AsyncAction => {
    return (dispatch) => {
        fetch(Env.get().fullUrl() + '/user/' + id, {
            method: 'GET',
            headers: ServiceBase.authenticationHeader
        }).then(
            resp => {
                if (resp.ok) {
                    resp.json().then(
                        data => {
                            const result = parse(data);
                            success(result);
                        }
                    )
                }
            }
        )
    }
}



export const LoadAllUsers = (success: (users: User[]) => void): AsyncAction => {
    return (dispatch) => {
        fetch(Env.get().fullUrl() + '/user/', {
            method: 'GET',
            headers: ServiceBase.authenticationHeader
        }).then(
            resp => {
                if (resp.ok) {
                    resp.json().then(
                        data => {
                            const result = (data as []).map(parse);
                            success(result);
                        }
                    )
                }
            }
        )
    }
}

export const UpdateUser = (user: User, success: (id: string) => void): AsyncAction => {
    return (dispatch) => {
        fetch(Env.get().fullUrl() + '/user/' + user.id + '/update', {
            method: 'POST',
            headers: ServiceBase.jsonHeader,
            body: JSON.stringify(user)
        }).then(
            resp => {
                resp.json().then(
                    json => {
                        if (resp.ok) {
                            success(json['id'])
                        } else {
                            dispatch(setErrorMessage(json['message']))
                        }
                    }
                )
            }
        )
    }
};

export const NewUserRequest = (user: User, success: (id: string) => void): AsyncAction => {
    return (dispatch) => {
        fetch(Env.get().fullUrl() + '/user/new', {
            method: 'POST',
            headers: ServiceBase.jsonHeader,
            body: JSON.stringify(user)
        }).then(
            resp => {
                resp.json().then(
                    json => {
                        if(resp.ok) {
                            success(json['id'])
                        } else {
                            dispatch(setErrorMessage(json['message']))
                        }
                    }
                )
            }
        )
    }
}