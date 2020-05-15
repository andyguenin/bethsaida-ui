export default class RaceStats{

    private readonly _count: number;
    private readonly _name: string;
    private readonly _race: string;


    constructor(name: string, race: string, count: number) {
        this._name = name;
        this._race = race;
        this._count = count;
    }

    get count(): number {
        return this._count;
    }

    get name(): string {
        return this._name;
    }

    get race(): string {
        return this._race;
    }
}