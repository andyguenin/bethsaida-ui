import {AsyncAction} from "../actions/Async";
import Env from "../environment/Env";
import ServiceBase from "./ServiceBase";
import SummaryStats from "../data/SummaryStats";

export const GetSummaryStats = (action: (s: SummaryStats) => void): AsyncAction => {
    return (d) => {
        fetch(Env.get().fullUrl() + '/stats/summary', {
            method: 'GET',
            headers: ServiceBase.authenticationHeader
        }).then(resp => {
            if(resp.ok) {
                resp.json().then(
                    json => {
                        const stats = new SummaryStats(
                            json['numAttendanceSheets'],
                            json['numClients'],
                            json['numUniqueVisits']
                        )
                        action(stats)
                    }
                )
            }
        })
    }
}
