export default class DatePoint {
    readonly t: Date;
    readonly y: number;

    constructor(t: Date, y: number) {
        this.t = t;
        this.y = y;
    }
}