import BDate from "../data/BDate";
import ArrayUtil from "./ArrayUtil";

export default class DateUtil {

    public static getAge(dateIn: BDate | undefined): string | undefined {
        if(dateIn !== undefined) {
            const today = new Date();
            const date = new Date(dateIn.year, dateIn.month - 1, dateIn.day);
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

    public static getEqualSpacedSeries(l: Date[], monthly: boolean): Date[] {
        const sorted = l.sort((a, b) => b < a ? 1 : (b === a ? 0 : -1))

        if(monthly) {
            console.log(sorted)
            const months = ((sorted[sorted.length - 1].getFullYear() * 12 + sorted[sorted.length - 1].getMonth())) -
                (sorted[0].getFullYear() * 12 + sorted[0].getMonth()) + 1

            let retval: Date[] = []

            for(let i = 0; i < months; ++i) {
                retval = retval.concat(new Date(sorted[0].getFullYear(), sorted[0].getMonth() + i))
            }
            return retval;
        } else {
            let date = sorted[0]

            let retval: Date[] = []

            while(date <= sorted[sorted.length - 1]) {
                retval = retval.concat(date)
                date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
            }

            return retval;
        }



    }
}