export default class MealRecord {
    public breakfast: number;
    public lunch: number;
    public readonly date: Date;
    public readonly id: string;


    constructor(breakfast: number, lunch: number, date: Date, id: string) {
        this.breakfast = breakfast;
        this.lunch = lunch;
        this.date = date;
        this.id = id;
    }

    public setField(field: string, value: string): MealRecord {
        let v = parseInt(value);
        if (Number.isNaN(v)) {
            v = 0
        }
        if (field === "breakfast") {
            this.breakfast = v;
        } else if (field === "lunch") {
            this.lunch = v;
        }
        return this
    }

}