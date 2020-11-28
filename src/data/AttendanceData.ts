export default class AttendanceData {
    readonly name: string;
    readonly date: Date;

    constructor(name: string, date: Date) {
        this.name = name;
        this.date = date;
    }
}