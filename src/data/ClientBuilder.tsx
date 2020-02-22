import BDate from "./BDate";
import Client from "./Client";

export default class ClientBuilder{
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

    get phone(): number | undefined {
        return this._phone;
    }

    get nicknames(): string[] | undefined {
        return this._nicknames;
    }

    get dateOfBirth(): BDate | undefined {
        return this._dateOfBirth;
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

    public setPhone(value?: number): ClientBuilder {
        this._phone = value;
        return this;
    }

    public setNicknames(value?: string[]): ClientBuilder {
        this._nicknames = value;
        return this;
    }

    public setDateOfBirth(value?: BDate): ClientBuilder {
        this._dateOfBirth = value;
        return this;
    }

    private _id?: string;
    private _firstName?: string;
    private _middleName?: string;
    private _lastName?: string;
    private _clientPhoto?: string;
    private _photoId?: string;
    private _phone?: number;
    private _nicknames?: string[];
    private _dateOfBirth?: BDate;


    build(): Client {
        if(this._firstName !== undefined && this._lastName !== undefined) {
            return new Client(
                this._firstName,
                this._lastName,
                this._nicknames,
                this._id,
                this._middleName,
                this._clientPhoto,
                this._photoId,
                this._phone,
                this._dateOfBirth
            )
        }
        else {
            throw new Error('Could not create client due to missing required fields.')
        }
    }

    public static load(client: Client): ClientBuilder {
        const cb = new ClientBuilder();
        return cb
            .setFirstName(client.firstName)
            .setLastName(client.lastName)
            .setNicknames(client.nicknames)
            .setId(client.id)
            .setMiddleName(client.middleName)
            .setClientPhoto(client.clientPhoto)
            .setPhotoId(client.photoId)
            .setPhone(client.phone)
            .setDateOfBirth(client.dateOfBirth)


    }

}
