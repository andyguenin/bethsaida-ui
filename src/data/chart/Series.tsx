import DatePoint from "./DatePoint";

export default class Series {
    readonly name: string;
    readonly data: DatePoint[];

    constructor(name: string, data: DatePoint[]) {
        this.name = name;
        this.data = data;
    }
}