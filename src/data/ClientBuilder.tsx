import BDate from "./BDate";
import Client from "./Client";
import {Race} from "./Race";
import {Gender} from "./Gender";
import User from "./User";


export default class ClientBuilder {
    get id(): string | undefined {
        return this._id;
    }

    get firstName(): string | undefined {
        return this._firstName;
    }

    get middleName(): string | undefined {
        return this._middleName;
    }

    get lastName(): string | undefined {
        return this._lastName;
    }

    get clientPhoto(): string | undefined {
        return this._clientPhoto;
    }

    get photoId(): string | undefined {
        return this._photoId;
    }

    get phone(): string | undefined {
        return this._phone;
    }

    get nicknames(): string[] | undefined {
        return this._nicknames;
    }

    get dateOfBirth(): string | undefined {
        return this._dateOfBirth;
    }

    get race(): Race | undefined {
        return this._race;
    }

    get race_secondary(): Race | undefined {
        return this._raceSecondary;
    }

    get gender(): Gender | undefined {
        return this._gender;
    }

    get intakeDate(): string | undefined {
        return this._intakeDate
    }

    public setId(value?: string): ClientBuilder {
        this._id = value;
        return this;
    }

    public setFirstName(value: string): ClientBuilder {
        this._firstName = value;
        return this;
    }

    public setMiddleName(value?: string): ClientBuilder {
        this._middleName = value;
        return this;
    }

    public setLastName(value: string): ClientBuilder {
        this._lastName = value;
        return this;
    }

    public setClientPhoto(value?: string): ClientBuilder {
        this._clientPhoto = value;
        return this;
    }

    public setPhotoId(value?: string): ClientBuilder {
        this._photoId = value;
        return this;
    }

    public setPhone(value?: string): ClientBuilder {
        this._phone = value;
        return this;
    }

    public setNicknames(value?: string[]): ClientBuilder {
        this._nicknames = value;
        return this;
    }

    public setDateOfBirth(value?: string): ClientBuilder {
        this._dateOfBirth = value;
        return this;
    }

    public setRace(value?: string): ClientBuilder {
        if (value !== undefined) {
            const idx = +value;
            this._race = Race[Race[idx] as keyof typeof Race];
        }
        return this;
    }

    public setRaceSecondary(value?: string): ClientBuilder {
        if (value !== undefined) {
            const idx = +value;
            this._raceSecondary = Race[Race[idx] as keyof typeof Race];
        }
        return this;
    }

    public setGender(value?: string): ClientBuilder {
        if (value !== undefined) {
            const idx = +value;
            this._gender = Gender[Gender[idx] as keyof typeof Gender];
        }
        return this;
    }

    public setIntakeDate(value?: string): ClientBuilder {
        this._intakeDate = value;
        return this;
    }

    public setIsBanned(banned: boolean): ClientBuilder {
        this._isBanned = banned;
        return this;
    }

    public getIsBanned(): boolean {
        return this._isBanned || false;
    }

    public setHispanic(hispanic: boolean): ClientBuilder {
        this._hispanic = hispanic;
        return this;
    }

    public getHispanic(): boolean {
        return this._hispanic || false;
    }

    public setBanId(id?: string): ClientBuilder {
        this._banId = id;
        return this;
    }

    public getBanId(): string | undefined {
        return this._banId;
    }

    public setIntakeUser(user?: User): ClientBuilder {
        this._intakeUser = user;
        return this;
    }

    public getIntakeUser(): User | undefined {
        return this._intakeUser;
    }

    public setCaseworkerPhone(value?: string): ClientBuilder {
        this._caseworkerPhone = value;
        return this;
    }

    public setCaseworkerName(value?: string): ClientBuilder {
        this._caseworkerName = value;
        return this;
    }

    get caseworkerName(): string | undefined {
        return this._caseworkerName;
    }

    get caseworkerPhone(): string | undefined {
        return this._caseworkerPhone
    }

    private _id?: string;
    private _firstName?: string;
    private _middleName?: string;
    private _lastName?: string;
    private _clientPhoto?: string;
    private _photoId?: string;
    private _phone?: string;
    private _nicknames?: string[];
    private _dateOfBirth?: string;
    private _race?: Race;
    private _gender?: Gender;
    private _intakeDate?: string;
    private _isBanned?: boolean;
    private _raceSecondary?: Race;
    private _hispanic?: boolean;
    private _banId?: string;
    private _intakeUser?: User;
    private _caseworkerName?: string;
    private _caseworkerPhone?: string;

    public setField(id: string, value: string) {
        switch (id) {
            case 'id':
                return this.setId(value);
            case 'firstName':
                return this.setFirstName(value);
            case 'middleName':
                return this.setMiddleName(value);
            case 'lastName':
                return this.setLastName(value);
            case 'clientPhoto':
                return this.setClientPhoto(value);
            case 'photoId':
                return this.setPhotoId(value);
            case 'phone':
                return this.setPhone(value);
            case 'nicknames':
                return this.setNicknames(value.split(','));
            case 'dateOfBirth':
                return this.setDateOfBirth(value);
            case 'race':
                return this.setRace(value);
            case 'race_secondary':
                return this.setRaceSecondary(value);
            case 'gender':
                return this.setGender(value);
            case 'intakeDate':
                return this.setIntakeDate(value);
            case 'hispanic':
                return this.setHispanic(value.toLowerCase() === 'true')
            case 'banId':
                return this.setBanId(value)
            case 'caseworkerName':
                return this.setCaseworkerName(value);
            case 'caseworkerPhone':
                return this.setCaseworkerPhone(value)
        }
    }


    public getImageById(id: string): string | undefined {
        if(id === 'clientPhoto') {
            return this._clientPhoto === '' ? undefined : this._clientPhoto;
        } else if (id === 'photoId') {
            return this._photoId === '' ? undefined : this._photoId;
        } else {
            return undefined;
        }
    }

    build(): Client {
        if (!(this._firstName === undefined
            || this._lastName === undefined
            || this._race === undefined
            || this._gender === undefined
            || this._intakeDate === undefined
            || this._intakeUser === undefined
        )) {
            return new Client(
                this._firstName,
                this._lastName,
                BDate.fromjsDate(this._dateOfBirth),
                this._race,
                this._gender,
                this._isBanned || false,
                this._intakeUser,
                BDate.fromjsDate(this._intakeDate),
                this._nicknames,
                this._id,
                this._middleName,
                this._clientPhoto === '' ? undefined : this._clientPhoto,
                this._photoId === '' ? undefined : this._photoId,
                (this.phone || '').replace(new RegExp('[^0-9]', 'g'), ''),
                this._raceSecondary,
                this._hispanic,
                this._banId,
                this._caseworkerName,
                (this._caseworkerPhone || '').replace(new RegExp('[^0-9]', 'g'), '')
            )
        } else {
            throw new Error('Could not create client due to missing required fields.')
        }
    }

    public getRaceByField(field: string): Race | undefined {
        if(field === 'race') {
            return this.race
        } else if(field === 'race_secondary') {
            return this.race_secondary
        } else {
            return undefined
        }
    }

    public static load(client?: Client): ClientBuilder {
        const cb = new ClientBuilder();
        if(client === undefined) {
            throw new Error('cannot build undefined client');
        }
        return cb
            .setFirstName(client.firstName)
            .setLastName(client.lastName)
            .setNicknames(client.nicknames)
            .setId(client.id)
            .setMiddleName(client.middleName)
            .setClientPhoto(client.clientPhoto)
            .setPhotoId(client.photoId)
            .setPhone(client.getPrettyPhone())
            .setDateOfBirth(client.dateOfBirth?.jsDate)
            .setRace(client.race.toString())
            .setRaceSecondary((client.raceSecondary || Race.OTHER_RACE).toString())
            .setGender(client.gender.toString())
            .setIntakeDate(client.intakeDate?.jsDate)
            .setHispanic(client.hispanic || false)
            .setBanId(client.banId)
            .setIntakeUser(client.intakeUser)
            .setCaseworkerName(client.caseworkerName)
            .setCaseworkerPhone(client.caseworkerPhone)


    }

    public static emptyBuilder(): ClientBuilder {
        return new ClientBuilder()
            .setFirstName('')
            .setLastName('')
            .setNicknames([])
            .setId('')
            .setMiddleName('')
            .setClientPhoto('')
            .setPhotoId('')
            .setPhone('')
            .setIsBanned(false)
            .setDateOfBirth('')
            .setRace(Race.OTHER_RACE.toString())
            .setRaceSecondary(Race.NOT_APPLICABLE.toString())
            .setGender(Gender.MALE.toString())
            .setIntakeDate(BDate.fromDate(new Date()).jsDate)
            .setHispanic(false)
            .setBanId(undefined)
            .setCaseworkerName('')
            .setCaseworkerPhone('')
            ;
    }
}
