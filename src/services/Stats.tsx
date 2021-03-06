import {AsyncAction} from "../actions/Async";
import Env from "../environment/Env";
import ServiceBase from "./ServiceBase";
import SummaryStats from "../data/SummaryStats";
import Stats from "../data/Stats";
import RaceStats from "../data/RaceStats";
import CovidStats from "../data/CovidStats";

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
                                0,
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
                                0,
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
                                d['dayShelterVisits'],
                                d['totalVisits'],
                                d['day']
                                )
                            ),
                            json['yearlyRaceStats'].map((d: any) => new RaceStats(
                                d['name'],
                                d['race'],
                                d['count']
                            )),
                            new CovidStats(
                                json['covidStats']['numberVaccinatedActiveClientsPastYear'],
                                json['covidStats']['numberUnvaccinatedActiveClientsPastYear']
                            )
                        )
                        action(stats)
                    }
                )
            }
        })
    }
}
