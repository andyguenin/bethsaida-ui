import {AsyncAction} from "../actions/Async";
import Env from "../environment/Env";
import ServiceBase from "./ServiceBase";
import {setErrorMessage} from "../actions/Base";
import Client from "../data/Client";
import User from "../data/User";
import MailRecord from "../data/MailRecord";
import MealRecord from "../data/MealRecord";

function parseMeal(l: any): MealRecord {
    return new MealRecord(l['breakfast'], l['lunch'], new Date(l['date']), l['id'])

}


export const GetMealRecord = (date: string, update: (r: MealRecord) => void): AsyncAction => {
    return (dispatch) => {
        fetch(Env.get().fullUrl() + '/meal/' + date, {
            method: 'GET',
            headers: ServiceBase.authenticationHeader
        }).then(
            resp => {
                if(resp.ok) {
                    resp.json().then(
                        json =>
                            update(parseMeal(json))
                    )
                } else {
                    dispatch(setErrorMessage("could not fetch meal information"))
                }
            }
        )
    }
}

export const PutMealRecord = (rec: MealRecord, action: () => void): AsyncAction => {
    return (dispatch) => {
        const mealRequest: any = {
            breakfast: rec.breakfast,
            lunch: rec.lunch,
            date: rec.date,
            id: rec.id
        }
        fetch(Env.get().fullUrl() + '/meal', {
            method: 'POST',
            headers: ServiceBase.jsonHeader,
            body: JSON.stringify(mealRequest)
        }).then(
            resp => {
                if(resp.ok) {
                    resp.json().then(
                        json => action()
                    )
                }
            }
        )
    }
}