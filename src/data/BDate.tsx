export default class BDate {
    readonly year: number;
    readonly month: number;
    readonly day: number;



    readonly jsDate: string

    constructor(year: number, month: number, day: number) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.jsDate = (year) + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2)
    }
}