import BDate from "./BDate";

export default class Client{
    public readonly firstName: string;
    public readonly lastName: string;

    public readonly nicknames?: string[];
    public readonly id?: string;
    public readonly middleName?: string;
    public readonly clientPhoto?: string;
    public readonly photoId?: string;
    public readonly phone?: number;
    public readonly dateOfBirth?: BDate;

    public readonly fullName: string;

    constructor(
        firstName: string,
        lastName: string,
        nicknames?: string[],
        id?: string,
        middleName?: string,
        clientPhoto?: string,
        photoId?: string,
        phone?: number,
        dateOfBirth?: BDate
    ) {
        this.id = id;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.clientPhoto = clientPhoto;
        this.photoId = photoId;
        this.phone = phone;
        this.nicknames = nicknames;
        this.dateOfBirth = dateOfBirth;

        this.fullName = firstName + " " + middleName + " " + lastName;
    }
}
