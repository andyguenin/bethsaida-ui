import Locker from "./Locker";
import BDate from "./BDate";
import Client from "./Client";
import User from "./User";

export default class LockerBuilder {
    get id(): string | undefined{
        return this._id;
    }

    setId(value?: string): LockerBuilder {
        this._id = value;
        return this;
    }

    get lockerNumber(): string | undefined {
        return this._lockerNumber;
    }

    setLockerNumber(value?: string) {
        this._lockerNumber = value;
        return this;
    }

    get startDate(): string | undefined {
        return this._startDate;
    }

    setStartDate(value?: string) {
        this._startDate = value;
        return this;
    }

    get endDate(): string | undefined {
        return this._endDate;
    }

    setEndDate(value?: string) {
        this._endDate = value;
        return this;
    }

    get expectedEndDate(): string | undefined {
        return this._expectedEndDate;
    }

    setExpectedEndDate(value?: string) {
        this._expectedEndDate = value;
        return this;
    }

    get inputUser(): User | undefined {
        return this._inputUser;
    }

    setInputUser(value?: User) {
        this._inputUser = value;
        return this;
    }

    get client(): Client | undefined {
        return this._client
    }

    setClient(client?: Client){
        this._client = client;
        return this;
    }

    private _id?: string;
    private _client?: Client;
    private _lockerNumber?: string;
    private _startDate?: string;
    private _endDate?: string;
    private _expectedEndDate?: string;
    private _inputUser?: User;

    public setField(id: string, value: string) {
        switch(id) {
            case 'id':
                return this.setId(value);
            case 'lockerNumber':
                return this.setLockerNumber(value);
            case 'startDate':
                return this.setStartDate(value);
            case 'endDate':
                return this.setEndDate(value);
            case 'expectedEndDate':
                return this.setExpectedEndDate(value);
            default:
                throw Error('could not set field')
        }
    }

    build(): Locker {
        if(!(
            this._lockerNumber === undefined ||
            this._startDate === undefined ||
            this._inputUser === undefined ||
            this._client === undefined
        )) {
            return new Locker(
                this._id || '',
                this._client,
                parseInt(this._lockerNumber),
                BDate.fromjsDate(this._startDate).toDate(),
                BDate.fromjsDate(this._expectedEndDate).toDate(),
                this._inputUser,
                this._endDate === undefined ? undefined : BDate.fromjsDate(this._endDate).toDate()
            )
        } else {
            throw Error('Cannot create Locker due to missing field')
        }
    }

    public static load(locker?: Locker): LockerBuilder {
        const l = new LockerBuilder();
        if(locker === undefined) {
            throw new Error('cannot build undefined locker');
        }

        return l.setClient(locker.client)
            .setId(locker.id)
            .setLockerNumber(locker.lockerNumber.toString())
            .setStartDate(locker.startDate.toDateString())
            .setEndDate(locker.endDate?.toDateString() || '')
            .setExpectedEndDate(locker.expectedEndDate.toDateString())
            .setInputUser(locker.inputUser)
    }


    public static emptyBuilder(): LockerBuilder {
        return new LockerBuilder()
            .setClient(undefined)
            .setLockerNumber('')
            .setStartDate('')
            .setEndDate('')
            .setExpectedEndDate('')
            .setInputUser(undefined)
    }

}