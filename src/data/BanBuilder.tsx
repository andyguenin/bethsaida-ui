import Ban from "./Ban";
import {BanType, parseBanType} from "./BanType";
import {ServiceType} from "./ServiceType";

export default class BanBuilder {
    private _start?: Date;
    private _active?: boolean;
    private _type?: string;
    private _stop?: Date;
    private _notes?: string;
    private _id?: string;
    private _clientId?: string;
    private _userId?: string;

    public setActive(active?: boolean): BanBuilder {
        this._active = active;
        return this;
    }

    public getActive(): boolean | undefined {
        return this._active;
    }

    public setStart(start?: Date): BanBuilder {
        this._start = start;
        return this;
    }

    public getStart(): Date | undefined {
        return this._start
    }

    public setStop(stop?: Date): BanBuilder {
        this._stop = stop;
        return this;
    }

    public getStop(): Date | undefined {
        return this._stop;
    }

    public setType(type?: string): BanBuilder {
        this._type = type;
        return this;
    }

    public getType(): string | undefined {
        return this._type;
    }

    public setNotes(notes?: string): BanBuilder {
        this._notes = notes;
        return this;
    }

    public getNotes(): string | undefined {
        return this._notes;
    }

    public setId(id?: string): BanBuilder {
        this._id = id;
        return this;
    }

    public getId(): string | undefined {
        return this._id;
    }

    public setClientId(clientId?: string): BanBuilder {
        this._clientId = clientId;
        return this;
    }

    public getClientId(): string | undefined {
        return this._clientId;
    }

    public setUserId(userId?: string): BanBuilder {
        this._userId = userId;
        return this;
    }

    public getUserId(): string | undefined {
        return this._userId;
    }

    public setValue(key: string, value?: string): BanBuilder {
        switch (key) {
            case 'start':
                return (value === undefined) ? this : this.setStart(new Date(value));
            case 'active':
                return (value === undefined) ? this.setActive(false) : this.setActive(value.toLowerCase() === 'true');
            case 'type':
                return (value === undefined) ? this : this.setType(value);
            case 'stop':
                return (value === undefined) ? this : this.setStop(new Date(value));
            case 'notes':
                return this.setNotes(value);
            case 'id':
                return this.setId(value);
            case 'clientId':
                return this.setClientId(value);
            case 'userId':
                return this.setUserId(value);
            default:
                return this;
        }
    }

    public static load(ban?: Ban): BanBuilder {
        return ban ?
            new BanBuilder()
                .setStart(ban.start)
                .setActive(ban.active)
                .setType(ban.banType)
                .setStop(ban.stop)
                .setNotes(ban.notes)
                .setId(ban.id)
                .setClientId(ban.clientId)
                .setUserId(ban.userId)
            : BanBuilder.empty()
    }

    public build(): Ban {
        if (this._start === undefined || this._active === undefined || this._type === undefined) {
            throw new Error("not all required ban elements have been set")
        } else {
            return new Ban(
                this._start,
                this._active,
                parseBanType(this._type),
                this._stop,
                this._notes,
                this._id,
                this._clientId,
                this._userId
            )
        }
    }

    public static empty(): BanBuilder {
        return new BanBuilder()
            .setStart(new Date())
            .setActive(false)
            .setType(BanType.DateBan)
            .setNotes('')
            .setId('')
            .setClientId('')
            .setUserId('')
    }
}