import Stats from "./Stats";

export default class SummaryStats {

    private _numAttendanceSheets: number
    private _numClients: number
    private _numUniqueVisits: number
    private _monthlyStats: Stats[]
    private _dailyStats: Stats[]

    constructor(numAttendanceSheets: number, numClients: number, numUniqueVisits: number, monthlyStats: Stats[], dailyStats: Stats[]) {
        this._numAttendanceSheets = numAttendanceSheets;
        this._numClients = numClients;
        this._numUniqueVisits = numUniqueVisits;
        this._monthlyStats = monthlyStats;
        this._dailyStats = dailyStats;
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
}