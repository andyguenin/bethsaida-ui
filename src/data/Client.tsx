import BDate from "./BDate";

export default class Client{
    public readonly id?: string;
    public readonly firstName: string;
    public readonly middleName: string;
    public readonly lastName: string;
    public readonly image: string;
    public readonly nicknames: string[];
    public readonly dateOfBirth: BDate;

    public readonly fullName: string;

    constructor(firstName: string, middleName: string, lastName: string, imageLoc: string, nicknames: string[], dateOfBirth: BDate, id: string) {
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.image = imageLoc;
        this.nicknames = nicknames;
        this.dateOfBirth = dateOfBirth;
        this.id = id;

        this.fullName = firstName + " " + middleName + " " + lastName;
    }
}
