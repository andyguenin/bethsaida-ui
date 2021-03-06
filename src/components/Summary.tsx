import React from 'react';
import YearlyStats from "../data/YearlyStats"
import Stats from "../data/Stats";

interface Props {
    yearlyStats: YearlyStats,
    yearlyServiceStats?: Stats
}

interface Feature {
    current: string | number,
    projected: string | number,
    previous: string | number
}

interface State {
    unique: Feature,
    day_shelter: Feature,
    total: Feature,
    numFemale: Feature,
    pctFemale: Feature,
    numMale: Feature,
    pctMale: Feature,
    numBlack: Feature,
    pctBlack: Feature,
    numWhite: Feature,
    pctWhite: Feature
}

export default class Summary extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            unique: {
                current: this.props.yearlyStats.current_year.numClients,
                projected: this.props.yearlyStats.current_year_proj.numClients,
                previous: this.props.yearlyStats.previous_year.numClients
            },
            day_shelter: {
                current: this.props.yearlyStats.current_year.dayShelterVisits,
                projected: this.props.yearlyStats.current_year_proj.dayShelterVisits,
                previous: this.props.yearlyStats.previous_year.dayShelterVisits
            },
            total: {
                current: this.props.yearlyStats.current_year.totalVisits,
                projected: this.props.yearlyStats.current_year_proj.totalVisits,
                previous: this.props.yearlyStats.previous_year.totalVisits
            },
            numFemale: {
                current: this.props.yearlyStats.current_year.numFemale,
                projected: this.props.yearlyStats.current_year_proj.numFemale,
                previous: this.props.yearlyStats.previous_year.numFemale
            },
            pctFemale: {
                current: this.percentOrDash(this.props.yearlyStats.current_year.numFemale / this.props.yearlyStats.current_year.totalVisits),
                projected: this.percentOrDash(this.props.yearlyStats.current_year_proj.numFemale / this.props.yearlyStats.current_year_proj.totalVisits),
                previous: this.percentOrDash(this.props.yearlyStats.previous_year.numFemale / this.props.yearlyStats.previous_year.totalVisits)
            },
            numMale: {
                current: this.props.yearlyStats.current_year.numMale,
                projected: this.props.yearlyStats.current_year_proj.numMale,
                previous: this.props.yearlyStats.previous_year.numMale
            },
            pctMale: {
                current: this.percentOrDash(this.props.yearlyStats.current_year.numMale / this.props.yearlyStats.current_year.totalVisits),
                projected: this.percentOrDash(this.props.yearlyStats.current_year_proj.numMale / this.props.yearlyStats.current_year_proj.totalVisits),
                previous: this.percentOrDash(this.props.yearlyStats.previous_year.numMale / this.props.yearlyStats.previous_year.totalVisits)
            },
            numBlack: {
                current: this.props.yearlyStats.current_year_black,
                projected: this.props.yearlyStats.current_year_proj_black,
                previous: this.props.yearlyStats.previous_year_black
            },
            pctBlack: {
                current: this.percentOrDash(this.props.yearlyStats.current_year_black / this.props.yearlyStats.current_year.totalVisits),
                projected: this.percentOrDash(this.props.yearlyStats.current_year_proj_black / this.props.yearlyStats.current_year_proj.totalVisits),
                previous: this.percentOrDash(this.props.yearlyStats.previous_year_black / this.props.yearlyStats.previous_year.totalVisits)
            },
            numWhite: {
                current: this.props.yearlyStats.current_year_white,
                projected: this.props.yearlyStats.current_year_proj_white,
                previous: this.props.yearlyStats.previous_year_white
            },
            pctWhite: {
                current: this.percentOrDash(this.props.yearlyStats.current_year_white / this.props.yearlyStats.current_year.totalVisits),
                projected: this.percentOrDash(this.props.yearlyStats.current_year_proj_white / this.props.yearlyStats.current_year_proj.totalVisits),
                previous: this.percentOrDash(this.props.yearlyStats.previous_year_white / this.props.yearlyStats.previous_year.totalVisits)
            }
        }
    }

    commafy(num: string | number) {
        if(typeof num === "string") {
            return num
        }
        let str = num.toString().split("").reverse().reduce((prev: string, current: string, idx: number, ar: string[]) => {
            const nw = current + prev
            if(nw.length % 4 === 3) {
                return ',' + nw
            }
            return nw
        }).split("")
        if(str[0] === ',') {
            str = str.splice(1)
        }
        return str.join("")
    }

    getRow(label: string, feature: Feature, dividerAfter: boolean = false) {
        return <tr className={dividerAfter ? 'divider' : ''}>
            <td>{label}</td>
            <td>{this.commafy(feature.current)}</td>
            <td>{this.commafy(feature.projected)}</td>
            <td>{this.commafy(feature.previous)}</td>
        </tr>
    }

    render(): React.ReactNode {
        return <div className={'chart-group'}>
            <table className='table table-hover'>
                <thead className='thead-dark'>
                <tr>
                    <th></th>
                    <th>{new Date().getFullYear()}</th>
                    <th>{new Date().getFullYear()} (projected)</th>
                    <th>{new Date().getFullYear() - 1}</th>
                </tr>
                </thead>
                <tbody>
                {this.getRow('Unique Client Visits', this.state.unique, true)}
                {this.getRow('Total Day Shelter Visits', this.state.day_shelter)}
                {this.getRow('Total Visits', this.state.total, true)}
                {this.getRow('Number Female Visits', this.state.numFemale)}
                {this.getRow('Percent Female Visits', this.state.pctFemale)}
                {this.getRow('Number Male Visits', this.state.numMale)}
                {this.getRow('Percent Male Visits', this.state.pctMale, true)}
                {this.getRow('Number Black Visits', this.state.numBlack)}
                {this.getRow('Percent Black Visits', this.state.pctBlack)}
                {this.getRow('Number White Visits', this.state.numWhite)}
                {this.getRow('Percent White Visits', this.state.pctWhite)}
                </tbody>
            </table>
        </div>
    }

    private thousandify(num: number): string {
        // const a = num.toString()
        return ''

    }
    private percentOrDash(num: number): string {
        if (isNaN(num)) {
            return '-'
        } else {
            return (num * 100).toFixed(2) + '%'
        }
    }
}