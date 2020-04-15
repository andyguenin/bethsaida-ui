import BDate from "./BDate";
import {Race} from "./Race";
import {Gender} from "./Gender";
import Ban from "./Ban";

export default class Client{
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly dateOfBirth: BDate;
    public readonly race: Race;
    public readonly gender: Gender;
    public readonly isBanned: boolean;
    public readonly intakeDate?: BDate;


    public readonly nicknames?: string[];
    public readonly id?: string;
    public readonly middleName?: string;
    public readonly clientPhoto?: string;
    public readonly photoId?: string;
    public readonly phone?: string;
    public readonly intakeUser?: string;
    public readonly fullName: string;
    public readonly raceSecondary?: Race;
    public readonly hispanic?: boolean;
    public readonly banId?: string;

    constructor(
        firstName: string,
        lastName: string,
        dateOfBirth: BDate,
        race: Race,
        gender: Gender,
        isBanned: boolean,
        intakeDate: BDate,
        nicknames?: string[],
        id?: string,
        middleName?: string,
        clientPhoto?: string,
        photoId?: string,
        phone?: string,
        intakeUser?: string,
        raceSecondary?: Race,
        hispanic?: boolean,
        banId?: string

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
        this.race = race;
        this.gender = gender;
        this.intakeDate = intakeDate;
        this.intakeUser = intakeUser;
        this.isBanned = isBanned;
        this.raceSecondary = raceSecondary;
        this.hispanic = hispanic;
        this.banId = banId;

        this.fullName = firstName + (middleName === undefined ? ' ' : ' ' + middleName + ' ') + lastName;
    }

    public getPrettyPhone(): string | undefined {
        if(this.phone !== undefined) {
            if(this.phone.length === 10) {
                return "(" + this.phone.slice(0, 3) + ") " + this.phone.slice(3, 6) + "-" + this.phone.slice(6);
            } else {
                return this.phone;
            }
        } else {
            return undefined
        }
    }

}
