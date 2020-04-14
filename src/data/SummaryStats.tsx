export default class SummaryStats {

    private _numAttendanceSheets: number
    private _numClients: number
    private _numUniqueVisits: number

    constructor(numAttendanceSheets: number, numClients: number, numUniqueVisits: number) {
        this._numAttendanceSheets = numAttendanceSheets;
        this._numClients = numClients;
        this._numUniqueVisits = numUniqueVisits;
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
}