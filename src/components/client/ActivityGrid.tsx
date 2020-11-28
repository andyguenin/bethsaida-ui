import React, {Fragment} from 'react';
import {Grid} from "./Grid";
import AttendanceData from "../../data/AttendanceData";

interface DateService {
    date: Date,
    service: Array<string>
}

interface DateServiceEnhanced {
    date: Date,
    service: Array<string>
    week: number
    day_of_week: number
}

interface Props {
    data?: AttendanceData[]
}

interface State {
    data: DateService[]
}

export class ActivityGrid extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        let d: DateService[] = []
        let all_data = props.data
        if (all_data) {
            for (let i = 0; i < all_data.length; i++) {
                const data = all_data[i]
                if (data) {
                    let f = d.find((dd) => dd.date === data.date)
                    if (f === undefined) {
                        d.push({
                            date: data.date,
                            service: [data.name]
                        })
                    } else {
                        f.service.push(data.name)
                    }
                }
            }
        }
        this.state = {data: d}

    }

    public render() {
        let visits = this.state.data
        visits.sort((a, b) => a.date.getTime() - b.date.getTime())
        let lower_bound_date = new Date() // 2020, 9, 1)
        lower_bound_date = new Date(lower_bound_date.getFullYear(), lower_bound_date.getMonth(), lower_bound_date.getDate() - 220)
        while (lower_bound_date.getDay() != 0) {
            lower_bound_date = new Date(lower_bound_date.getFullYear(), lower_bound_date.getMonth(), lower_bound_date.getDate() - 1)
        }
        const lower_bound_day = lower_bound_date.getDay()
        let current_day = new Date(lower_bound_date)
        const today = new Date()
        visits = visits.filter((f) => f.date >= lower_bound_date && f.date <= today)
        let grid_data: Array<DateServiceEnhanced> = []
        let week = -1
        while (current_day <= today) {
            let service = (() => {
                if (visits.length > 0 &&
                    current_day.getTime() === visits[0].date.getTime()) {
                    let service = visits[0].service;
                    visits = visits.splice(1);
                    return service;

                } else {
                    return [];
                }
            })()
            if (current_day !== lower_bound_date && current_day.getDay() === 0) {
                week += 1
            }
            grid_data.push({
                date: new Date(current_day),
                service: service,
                day_of_week: current_day.getDay(),
                week
            })
            current_day.setDate(current_day.getDate() + 1)
        }
        return <Fragment>
            <div>Check-ins</div>
            <Grid id='grid-container' className='grid-class' data={grid_data}/>
        </Fragment>
    }
}