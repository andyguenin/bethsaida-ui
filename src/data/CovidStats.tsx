export default class CovidStats {
    readonly vaccinated: number;
    readonly unvaccinated: number


    constructor(vaccinated: number, unvaccinated: number) {
        this.vaccinated = vaccinated;
        this.unvaccinated = unvaccinated;
    }
}