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

    static fromDate(date: Date): BDate {
        return new BDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }

    static fromjsDate(date?: string): BDate {
        if (date === undefined) {
            return new BDate(0, 0, 0);
        } else {
            const splt = date.split('-');
            return new BDate(+splt[0], +splt[1], +splt[2]);
        }
    }
}