import {AsyncAction} from "../actions/Async";
import Env from "../environment/Env";
import ServiceBase from "./ServiceBase";
import User from "../data/User"

const parse = (data: any): User => {
    return new User(
        data['id'],
        data['name']
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
                if(resp.ok) {
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