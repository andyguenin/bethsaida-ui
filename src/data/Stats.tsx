export default class  Stats {
    readonly month: number
    readonly year: number
    readonly day: number
    readonly numClients: number
    readonly numEvents: number
    readonly numFemale: number
    readonly numMale: number
    readonly serviceName: string
    readonly dayShelterVisits: number
    readonly totalVisits: number

    constructor(
        month: number,
        year: number,
        numClients: number,
        numEvents: number,
        numFemale: number,
        numMale: number,
        serviceName: string,
        dayShelterVisits: number,
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
        this.dayShelterVisits = dayShelterVisits
        this.totalVisits = totalVisits;
    }

    public numOther(): number {
        return this.totalVisits - this.numFemale - this.numMale
    }


    public static empty(): Stats {
        return new Stats(1, 1900, 0, 0, 0, 0, '', 0, 0)
    }

}