export default class Client{
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly imageLoc: string;

    public readonly fullName: string;

    constructor(firstName: string, lastName: string, imageLoc: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.imageLoc = imageLoc;

        this.fullName = firstName + " " + lastName;
    }
}


export const testClients = [
    new Client("Andy", "Guenin", "null"),
    new Client("Teddy", "Guenin", "null"),
    new Client("Anne", "Guenin", "null")
]