import {AsyncAction} from "../actions/Async";
import Env from "../environment/Env";
import ServiceBase from "./ServiceBase";
import SummaryStats from "../data/SummaryStats";
import Stats from "../data/Stats";
import RaceStats from "../data/RaceStats";

export const GetSummaryStats = (action: (s: SummaryStats) => void): AsyncAction => {
    return (d) => {
        fetch(Env.get().fullUrl() + '/stats/summary', {
            method: 'GET',
            headers: ServiceBase.authenticationHeader
        }).then(resp => {
            if (resp.ok) {
                resp.json().then(
                    json => {
                        const stats = new SummaryStats(
                            json['numAttendanceSheets'],
                            json['numClients'],
                            json['numUniqueVisits'],
                            json['monthlyStats'].map((d: any) => new Stats(
                                d['month'],
                                d['year'],
                                d['numClients'],
                                d['numEvents'],
                                d['numFemale'],
                                d['numMale'],
                                d['serviceName'],
                                d['totalVisits']
                                )
                            ),
                            json['dailyStats'].map((d: any) => new Stats(
                                d['month'],
                                d['year'],
                                d['numClients'],
                                d['numEvents'],
                                d['numFemale'],
                                d['numMale'],
                                d['serviceName'],
                                d['totalVisits'],
                                d['day']
                                )
                            ),
                            json['yearlyStats'].map((d: any) => new Stats(
                                d['month'],
                                d['year'],
                                d['numClients'],
                                d['numEvents'],
                                d['numFemale'],
                                d['numMale'],
                                d['serviceName'],
                                d['totalVisits'],
                                d['day']
                                )
                            ),
                            json['yearlyRaceStats'].map((d: any) => new RaceStats(
                                d['name'],
                                d['race'],
                                d['count']
                            ))
                        )
                        action(stats)
                    }
                )
            }
        })
    }
}
