import Stats from "./Stats";
import RaceStats from "./RaceStats";
import CovidStats from "./CovidStats";

export default class SummaryStats {

    private _numAttendanceSheets: number
    private _numClients: number
    private _numUniqueVisits: number
    private _monthlyStats: Stats[]
    private _dailyStats: Stats[]
    private _yearlyStats: Stats[]
    private _raceStats: RaceStats[]
    private _covidStats: CovidStats

    constructor(
        numAttendanceSheets: number,
        numClients: number,
        numUniqueVisits: number,
        monthlyStats: Stats[],
        dailyStats: Stats[],
        yearlyStats: Stats[],
        raceStats: RaceStats[],
        covidStats: CovidStats
    ) {
        this._numAttendanceSheets = numAttendanceSheets;
        this._numClients = numClients;
        this._numUniqueVisits = numUniqueVisits;
        this._monthlyStats = monthlyStats;
        this._dailyStats = dailyStats;
        this._yearlyStats = yearlyStats;
        this._raceStats = raceStats;
        this._covidStats = covidStats;
    }

    get numAttendanceSheets(): number {
        return this._numAttendanceSheets;
    }

    get numClients(): number {
        return this._numClients;
    }

    get numUniqueVisits(): number {
        return this._numUniqueVisits;
    }

    get monthlyStats(): Stats[] {
        return this._monthlyStats;
    }

    get dailyStats(): Stats[] {
        return this._dailyStats;
    }

    get yearlyStats(): Stats[] {
        return this._yearlyStats;
    }

    get covidStats(): CovidStats {
        return this._covidStats
    }

    public getNumberOfWhite(name: string): number {
        const retVal = this._raceStats.filter(r => r.name === name && r.race.toLowerCase() === 'white').map(r => r.count)
        if (retVal.length === 0) {
            return 0
        } else {
            return retVal.reduce((a, b) => a + b)
        }
    }

    public getNumberOfBlack(name: string): number {
        const retVal = this._raceStats.filter(r => r.name === name && r.race.toLowerCase() === 'black').map(r => r.count)
        if (retVal.length === 0) {
            return 0
        } else {
            return retVal.reduce((a, b) => a + b)
        }
    }

    public getNumberOfOther(name: string): number {
        const retVal = this._raceStats.filter(r => r.name === name && !(r.race.toLowerCase() === 'black' || r.race.toLowerCase() === 'white')).map(r => r.count)
        if (retVal.length === 0) {
            return 0
        } else {
            return retVal.reduce((a, b) => a + b)
        }
    }
}