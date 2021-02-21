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
    data: AttendanceData[]
}

interface State {
    data: DateService[]
}

export class ActivityGrid extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        let d: DateService[] = []
        let all_data = props.data.sort((f, g) => f.date.getTime() - g.date.getTime())
        let map: any = {}
        for (let i = 0; i < all_data.length; i++) {
            const data = all_data[i]
            const date = data.date.getTime().toString()
            if (map.hasOwnProperty(date)) {
                map[date] = map[date].concat(data.name)
                console.log(map)
            } else {
                map[date] = [data.name]
                console.log(map)
            }
        }
        for (const key in map) {
            d = d.concat({date: new Date(+key), service: map[key]})
        }
        this.state = {data: d}

    }

    public checkinSummary = (grid: Array<DateServiceEnhanced>) => {
        const reversed_filtered = grid.filter((f) => f.service.length > 0).reverse()
        const a = reversed_filtered.slice(0, Math.min(reversed_filtered.length, 5))
            .map((f) => <li>{f.date.toLocaleDateString()}<ul>{f.service.map((g) => <li>{g}</li>)}</ul></li>)
        if (a.length === 0) {
            return <Fragment>
                <div><b>No user check-ins have been recorded.</b></div>
            </Fragment>
        } else {
            return <Fragment>
                <div><b>Latest {a.length} checkins</b></div>
                <ul>{a}</ul>
            </Fragment>
        }
    }

    public render() {
        let visits = this.state.data
        visits.sort((a, b) => a.date.getTime() - b.date.getTime())
        let lower_bound_date = new Date() // 2020, 9, 1)
        lower_bound_date = new Date(lower_bound_date.getFullYear(), lower_bound_date.getMonth(), lower_bound_date.getDate() - 220)
        while (lower_bound_date.getDay() != 0) {
            lower_bound_date = new Date(lower_bound_date.getFullYear(), lower_bound_date.getMonth(), lower_bound_date.getDate() - 1)
        }
        let current_day = new Date(lower_bound_date)
        const today = new Date()
        visits = visits.filter((f) => f.date >= lower_bound_date && f.date <= today)
        let grid_data: Array<DateServiceEnhanced> = []
        let week = -1
        while (current_day <= today) {
            // let service = visits.filter((f) => f.date.getTime() == current_day.getTime()).map((f) => f.service)
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
                service: service.sort(),
                day_of_week: current_day.getDay(),
                week
            })
            current_day.setDate(current_day.getDate() + 1)
        }

        return <Fragment>
            <div className='d-sm-none d-lg-inline'>
            <div>Check-ins</div>
            <Grid id='grid-container' className='grid-class' data={grid_data}/>
        </div>
            <div className='d-sm-inline d-lg-none'>
                {this.checkinSummary(grid_data)}
            </div>
        </Fragment>
    }
}