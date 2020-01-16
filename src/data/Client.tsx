import BDate from "./Date";

export default class Client{
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly image: string;
    public readonly nicknames: string[];
    public readonly dateOfBirth: BDate;

    public readonly fullName: string;

    constructor(firstName: string, lastName: string, imageLoc: string, nicknames: string[], dateOfBirth: BDate) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.image = imageLoc;
        this.nicknames = nicknames;
        this.dateOfBirth = dateOfBirth;

        this.fullName = firstName + " " + lastName;
    }
}
