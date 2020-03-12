import {BanType} from "./BanType";

export default class Ban {
    public readonly start: Date;
    public readonly active: boolean;
    public readonly banType: BanType;


    public readonly stop?: Date;
    public readonly notes?: string;
    public readonly id?: string;
    public readonly clientId?: string;
    public readonly userId?: string;

    public readonly stringRepresentation: string;


    constructor(
        start: Date,
        active: boolean,
        type: BanType,
        stop?: Date,
        notes?: string,
        id?: string,
        clientId?: string,
        userId?: string
    ) {
        this.start = start;
        this.active = active;
        this.banType = type;
        this.stop = stop;
        this.notes = notes;
        this.id = id;
        this.clientId = clientId;
        this.userId = userId;

        this.stringRepresentation = this.getString();
    }


    private getString(): string {
        switch (this.banType) {
            case BanType.DateBan:
                return "until " + this.stop?.toLocaleDateString();
            case BanType.PermanentBan:
                return 'permanently'
            case BanType.IndefiniteBan:
                return 'indefinitely';
            default:
                return 'for an unspecified amount of time';
        }
    }
}
