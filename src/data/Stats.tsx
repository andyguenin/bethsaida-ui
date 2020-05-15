export default class  Stats {
    readonly month: number
    readonly year: number
    readonly day: number
    readonly numClients: number
    readonly numEvents: number
    readonly numFemale: number
    readonly numMale: number
    readonly serviceName: string
    readonly totalVisits: number

    constructor(
        month: number,
        year: number,
        numClients: number,
        numEvents: number,
        numFemale: number,
        numMale: number,
        serviceName: string,
        totalVisits: number,
        day: number = 1
    ) {
        this.month = month;
        this.year = year;
        this.day = day;
        this.numClients = numClients;
        this.numEvents = numEvents;
        this.numFemale = numFemale;
        this.numMale = numMale;
        this.serviceName = serviceName;
        this.totalVisits = totalVisits;
    }

    public numOther(): number {
        return this.totalVisits - this.numFemale - this.numMale
    }


    public static empty(): Stats {
        return new Stats(1, 1900, 0, 0, 0, 0, '', 0)
    }

}