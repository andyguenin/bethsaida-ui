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

    get idVoucher(): string | undefined {
        return this._idVoucher
    }

    get hmis(): number | undefined {
        return this._hmis
    }

    get path(): boolean | undefined {
        return this._path
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

    public setLast4Ssn(value?: string): ClientBuilder{
        this._last4ssn = value
        return this;
    }

    get last4Ssn(): string | undefined {
        return this._last4ssn;
    }

    public getVeteran(): boolean {
        return this._veteran || false
    }

    public setVeteran(veteran: boolean): ClientBuilder {
        this._veteran = veteran;
        return this;
    }

    public getCovidVaccine(): boolean {
        return this._covidVaccine || false
    }

    public setCovidVaccine(covidVaccine: boolean): ClientBuilder {
        this._covidVaccine = covidVaccine;
        return this;
    }

    public setIDVoucher(idVoucher?: string): ClientBuilder {
        this._idVoucher = idVoucher
        return this;
    }

    public setHMIS(hmis?: number): ClientBuilder {
        if (Number.isNaN(hmis)) {
            this._hmis = undefined;
        } else {
            this._hmis = hmis;
        }
        console.log(this._hmis)
        return this;
    }

    public setPATH(path?: boolean): ClientBuilder {
        this._path = path;
        return this;
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
    private _veteran?: boolean;
    private _banId?: string;
    private _intakeUser?: User;
    private _caseworkerName?: string;
    private _caseworkerPhone?: string;
    private _last4ssn?: string
    private _covidVaccine?: boolean
    private _idVoucher?: string
    private _hmis?: number
    private _path?: boolean

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
            case 'last4Ssn':
                return this.setLast4Ssn(value)
            case 'veteran':
                return this.setVeteran(value.toLowerCase() === 'true')
            case 'covid_vaccine':
                return this.setCovidVaccine(value.toLowerCase() === 'true')
            case 'idVoucher':
                return this.setIDVoucher(value)
            case 'hmis':
                return this.setHMIS(parseInt(value))
            case 'path':
                return this.setPATH(value === 'na' ? undefined : value === 'true')
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
            const client = new Client(
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
                (this._caseworkerPhone || '').replace(new RegExp('[^0-9]', 'g'), ''),
                this._last4ssn,
                this._veteran,
                this._covidVaccine,
                {idVoucher: this._idVoucher === undefined || this._idVoucher === '' ? undefined : BDate.fromjsDate(this._idVoucher), path: this._path, hmis: this._hmis}

            )
            return client
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
            .setLast4Ssn(client.last4Ssn)
            .setVeteran(client.veteran || false)
            .setCovidVaccine(client.covidVaccine || false)
            .setIDVoucher(client.extraParameters?.idVoucher?.jsDate)
            .setHMIS(client.extraParameters?.hmis)
            .setPATH(client.extraParameters?.path)


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
            .setLast4Ssn('')
            .setVeteran(false)
            .setIDVoucher(undefined)
            .setHMIS(undefined)
            .setPATH(undefined)
            ;
    }
}
