import BDate from "../data/BDate";

export default class DateUtil {

    public static getAge(dateIn: BDate | undefined): string | undefined {
        if(dateIn !== undefined) {
            const today = new Date();
            const date = new Date(dateIn.year, dateIn.month, dateIn.day);
            let age = today.getFullYear() - date.getFullYear();
            const m = today.getMonth() - date.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
                age--;
            }
            return age + ' years old';
        } else {
            return undefined;
        }
    }
}