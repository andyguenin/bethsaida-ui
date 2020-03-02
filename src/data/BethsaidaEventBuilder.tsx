import BethsaidaEvent from "./BethsaidaEvent";
import BDate from "./BDate";

export default class BethsaidaEventBuilder {
    private _id?: string;
    private _serviceId?: string;
    private _capacity?: number;
    private _date?: string;

    public setId(id: string): BethsaidaEventBuilder {
        this._id = id;
        return this;
    }

    public id(): string | undefined {
        return this._id;
    }

    public setServiceId(serviceId: string): BethsaidaEventBuilder {
        this._serviceId = serviceId;
        return this;
    }

    public serviceId(): string | undefined {
        return this._serviceId;
    }

    public setCapacity(capacity: string): BethsaidaEventBuilder {
        if(capacity === '') {
            this._capacity = -1
        } else {
            const num = +capacity;
            if(isNaN(num)) {
                this._capacity = -1
            } else {
                this._capacity = num;
            }
        }
        return this;
    }

    public capacity(): number | undefined {
        return this._capacity
    }

    public setDate(date: string): BethsaidaEventBuilder {
        this._date = date;
        return this;
    }

    public getDate(): string | undefined {
        return this._date;
    }

    public setField(field: string, value: string): BethsaidaEventBuilder {
        switch(field) {
            case 'id':
                return this.setId(value);
            case 'serviceId':
                return this.setServiceId(value);
            case 'capacity':
                return this.setCapacity(value);
            case 'date':
                return this.setDate(value);
            default:
                return this;

        }
    }

    public build(): BethsaidaEvent {
        if(this._id === undefined || this._serviceId === undefined || this._capacity === undefined || this._date === undefined) {
            console.log(this);
            throw Error('Could not create event object. Missing some fields');
        }
        return new BethsaidaEvent(
            this._id,
            this._serviceId,
            this._capacity,
            BDate.fromjsDate(this._date)
        );
    }

    public static load(service?: BethsaidaEvent): BethsaidaEventBuilder {
        if(service === undefined) {
            return this.emptyBuilder();
        } else {
            return new BethsaidaEventBuilder()
                .setId(service.id)
                .setServiceId(service.serviceId)
                .setCapacity(service.capacity.toString())
                .setDate(service.date.jsDate)
        }
    }

    public static emptyBuilder(): BethsaidaEventBuilder {
        return new BethsaidaEventBuilder()
            .setId('')
            .setServiceId('')
            .setCapacity("0")
            .setDate(BDate.fromDate(new Date()).jsDate)
            ;
    }
}