import BDate from "./BDate";
import Client from "./Client";
import {Race} from "./Race";
import {Gender} from "./Gender";


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
            case 'gender':
                return this.setGender(value);
            case 'intakeDate':
                return this.setIntakeDate(value);
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
            || this.phone === undefined
            || this._race === undefined
            || this._gender === undefined
            || this._intakeDate === undefined
        )) {
            return new Client(
                this._firstName,
                this._lastName,
                BDate.fromjsDate(this._dateOfBirth),
                this._race,
                this._gender,
                BDate.fromjsDate(this._intakeDate),
                this._nicknames,
                this._id,
                this._middleName,
                this._clientPhoto === '' ? undefined : this._clientPhoto,
                this._photoId === '' ? undefined : this._photoId,
                this.phone.replace(' ', '').replace('-', '').replace(')', '').replace('(', '')
            )
        } else {
            throw new Error('Could not create client due to missing required fields.')
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
            .setGender(client.gender.toString())
            .setIntakeDate(client.intakeDate?.jsDate)


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
            .setDateOfBirth('')
            .setRace(Race.NONWHITE.toString())
            .setGender(Gender.MALE.toString())
            .setIntakeDate(BDate.fromDate(new Date()).jsDate);
    }
}
