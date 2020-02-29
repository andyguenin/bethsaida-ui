import BethsaidaEvent from "./BethsaidaEvent";

export default class BethsaidaEventBuilder {
    private _id?: string;

    public setId(id: string): BethsaidaEventBuilder {
        this._id = id;
        return this;
    }

    public id(): string | undefined {
        return this._id
    }

    public setField(field: string, value: string): BethsaidaEventBuilder {
        switch(field) {
            case 'id':
                return this.setId(value);
            default:
                return this;

        }
    }

    public build(): BethsaidaEvent {
        if(this._id === undefined) {
            throw Error('Could not create event object. Missing some fields');
        }
        return new BethsaidaEvent(
            this._id
        );
    }

    public static load(service: BethsaidaEvent): BethsaidaEventBuilder {
        return new BethsaidaEventBuilder()
            .setId(service.id);
    }

    public static emptyBuilder(): BethsaidaEventBuilder {
        return new BethsaidaEventBuilder();
    }
}