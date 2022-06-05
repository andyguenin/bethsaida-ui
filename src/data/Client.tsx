import BDate from "./BDate";
import {Race} from "./Race";
import {Gender} from "./Gender";
import emptyImage from '../assets/unknown-image.png'
import Env from "../environment/Env";
import React from "react";
import User from "./User";

export interface ExtraParameters {
    idVoucher?: BDate
    hmis?: number
    path?: boolean
}

export const createExtraParameters: (p: any) => ExtraParameters = (p: any) => {
    return {
        idVoucher: p.hasOwnProperty('idVoucher') ? new BDate(p['idVoucher']['year'], p['idVoucher']['month'], p['idVoucher']['day']) : undefined,
        hmis: p['hmis'] === undefined ? undefined : (p['hmis'] !== 0 ? 1 : 0),
        path: p['path']
    }
}

export default class Client {
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly dateOfBirth: BDate;
    public readonly race: Race;
    public readonly gender: Gender;
    public readonly isBanned: boolean;
    public readonly intakeUser: User;
    public readonly intakeDate?: BDate;


    public readonly nicknames?: string[];
    public readonly id?: string;
    public readonly middleName?: string;
    public readonly clientPhoto?: string;
    public readonly photoId?: string;
    public readonly phone?: string;

    public readonly extraParameters?: ExtraParameters;

    public readonly fullName: string;
    public readonly raceSecondary?: Race;
    public readonly hispanic?: boolean;
    public readonly banId?: string;
    public readonly last4Ssn?: string;
    public readonly veteran?: boolean;

    public readonly caseworkerName?: string;
    public readonly caseworkerPhone?: string;

    public readonly covidVaccine?: boolean;

    constructor(
        firstName: string,
        lastName: string,
        dateOfBirth: BDate,
        race: Race,
        gender: Gender,
        isBanned: boolean,
        intakeUser: User,
        intakeDate: BDate,
        nicknames?: string[],
        id?: string,
        middleName?: string,
        clientPhoto?: string,
        photoId?: string,
        phone?: string,
        raceSecondary?: Race,
        hispanic?: boolean,
        banId?: string,
        caseworkerName?: string,
        caseworkerPhone?: string,
        last4Ssn?: string,
        veteran?: boolean,
        covidVaccine?: boolean,
        extraParameters?: ExtraParameters
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
        this.caseworkerName = caseworkerName;
        this.caseworkerPhone = caseworkerPhone;
        this.last4Ssn = last4Ssn;
        this.veteran = veteran;
        this.fullName = firstName + (middleName === undefined ? ' ' : ' ' + middleName + ' ') + lastName;
        this.covidVaccine = covidVaccine;
        this.extraParameters = extraParameters;
    }

    private imageUrl = Env.get().imageUrl;

    public idVoucher(): BDate | undefined {
        return this.extraParameters?.idVoucher
    }

    public hmisString(): string | undefined {
        return this.extraParameters?.hmis === undefined ? undefined : (this.extraParameters.hmis !== 0 ? "Yes" : "No")
    }

    public pathString(): string | undefined {
        return this.extraParameters?.path === undefined ? undefined : (this.extraParameters.path ? "Yes" : "No")
    }

    public getPrettyPhone(): string | undefined {
        if (this.phone !== undefined) {
            if (this.phone.length === 10) {
                return "(" + this.phone.slice(0, 3) + ") " + this.phone.slice(3, 6) + "-" + this.phone.slice(6);
            } else {
                return this.phone;
            }
        } else {
            return undefined
        }
    }

    public smallImageTag() {
        if (this.clientPhoto !== undefined) {
            return <img src={this.imageUrl + '/' + this.clientPhoto + '_250.png'}/>
        }

        if (this.photoId !== undefined) {
            return <img src={this.imageUrl + '/' + this.photoId + '_250.png'}/>
        }
        return <img src={emptyImage} width='250px'/>
    }

    public toJson = (): any => {
        let obj: any = Object.assign({}, this)
        const id = this.intakeUser.id
        delete obj['intakeUser'];
        obj['intakeUserId'] = id
        return obj
    }

}
