import React from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import FileContainer from "../../components/app/FileContainer";
import {GetSummaryStats} from "../../services/Stats";
import SummaryStats from "../../data/SummaryStats";
import {Loader} from "../../components/app/loader/Loader";
import {DailyLineChart} from "../../components/app/chart/DailyLineChart";
import Series from "../../data/chart/Series";
import DatePoint from "../../data/chart/DatePoint";
import {MonthlyBarChart} from "../../components/app/chart/MonthlyBarChart";
import Stats from "../../data/Stats";
import Expander from "../../components/app/Expander";
import {MonthlyLineChart} from "../../components/app/chart/MonthlyLineChart";
import DataTable from "../../components/app/DataTable";
import YearlyStats from "../../data/YearlyStats"
import Summary from "../../components/Summary";


const mapStateToProps = (state: AppState) => state

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        summaryStats: (action: (s: SummaryStats) => void) => dispatch(GetSummaryStats(action))
    }
}


const connector = connect(
    mapStateToProps,
    mapDispatchToProps
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}

interface State {
    stats?: SummaryStats
    filteredIntakeSeries: Series
    month12uniqueVisits: Series[]
    month12totalVisits: Series[]
    day30uniqueVisits: Series[]
    month30dayShelterGender: Series[]
    yearlyStats: YearlyStats
}

class Dashboard extends React.Component<Props, State> {

    dateformat = require('dateformat')

    extractFilteredIntakeSeries = (monthlyStats: Stats[]) => {
        const s = new Series("Intake", monthlyStats.map(ms =>
                new DatePoint(new Date(ms.year, ms.month), ms.totalVisits)
            )
                .filter(dp => {
                    const monthDiff =
                        (new Date().getFullYear() - dp.t.getFullYear()) * 12 + (new Date().getMonth() - dp.t.getMonth())
                    return monthDiff >= 0 && monthDiff <= 12
                }).sort((a, b) => {
                    return -(b.t.getFullYear() * 12 + b.t.getMonth()) + (a.t.getFullYear() * 12 + a.t.getMonth())
                })
        )
        return s;
    }

    extractSeries = (stats: Stats[], firstDayOfPeriod: Date, mapper: (s: Stats) => number): Series[] => {
        let names: string[] = stats
            .map(d => d.serviceName)
            .sort((a, b) => a.localeCompare(b))
        names = names
            .filter((d, i) => {
                return i === 0 || names[i - 1] !== d
            })

        const ret = names.map(n => {
            return new Series(
                n,
                stats
                    .filter(s => s.serviceName === n).filter(s => new Date(s.year, s.month - 1, s.day) >= firstDayOfPeriod)
                    .map(r => new DatePoint(new Date(r.year, r.month - 1, r.day), mapper(r)))
            )
        })
        return ret;
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            month12uniqueVisits: [],
            month12totalVisits: [],
            filteredIntakeSeries: new Series("intake", []),
            day30uniqueVisits: [],
            month30dayShelterGender: [],
            yearlyStats: {
                current_year: Stats.empty(),
                current_year_proj: Stats.empty(),
                previous_year: Stats.empty(),
                current_year_black: 0,
                current_year_proj_black: 0,
                previous_year_black: 0,
                current_year_proj_white: 0,
                current_year_white: 0,
                previous_year_white: 0,
                current_year_other: 0,
                current_year_proj_other: 0,
                previous_year_other: 0
            }
        }

        const now = new Date()
        const month12Ago = new Date(now.getFullYear(), now.getMonth() - 12, 1)

        const day30Ago = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)


        this.props.summaryStats(stats => {

            const genderBreakdown = (["Male", "Female", "Other"]).map(g => {

                let f: (s: Stats) => number
                if(g === "Male") {
                    f = (s) => s.numMale
                } else if(g === "Female") {
                    f = (s) => s.numFemale
                } else {
                    f = (s) => s.numClients - (s.numFemale + s.numMale)
                }
                return new Series(
                    g,
                    stats.monthlyStats
                        .filter(s => s.serviceName.toLowerCase() === 'day shelter')
                        .filter(s => {
                            const d = new Date(s.year, s.month, s.day)
                            const com = (d >= month12Ago && d <= new Date())
                            return com
                        })
                        .map(r => new DatePoint(new Date(r.year, r.month, r.day), f(r)))
                )
            })

            this.setState(Object.assign({}, this.state, {
                stats,
                month12uniqueVisits: this.extractSeries(
                    stats.monthlyStats.filter(r => r.serviceName.toLowerCase() !== 'intake'),
                    month12Ago,
                    r => r.numClients
                ),
                month12totalVisits: this.extractSeries(
                    stats.monthlyStats.filter(r => r.serviceName.toLowerCase() !== 'intake'),
                    month12Ago,
                    r => r.totalVisits
                ),
                filteredIntakeSeries: this.extractFilteredIntakeSeries(stats.monthlyStats.filter(r => r.serviceName.toLowerCase() === 'intake')),
                day30uniqueVisits: this.extractSeries(
                    stats.dailyStats,
                    day30Ago,
                    r => r.totalVisits
                ),
                month30dayShelterGender: genderBreakdown,
                yearlyStats: {
                    current_year: stats.yearlyStats.find(r => r.serviceName === 'current_total') || Stats.empty(),
                    current_year_proj: stats.yearlyStats.find(r => r.serviceName === 'current_projection') || Stats.empty(),
                    previous_year: stats.yearlyStats.find(r => r.serviceName === 'prev_total') || Stats.empty(),
                    current_year_black: stats.getNumberOfBlack('current_total'),
                    current_year_proj_black: stats.getNumberOfBlack('current_projection'),
                    previous_year_black: stats.getNumberOfBlack('prev_total'),
                    current_year_proj_white: stats.getNumberOfWhite('current_total'),
                    current_year_white: stats.getNumberOfWhite('current_projection'),
                    previous_year_white: stats.getNumberOfWhite('prev_total'),
                    current_year_other: stats.getNumberOfOther('current_total'),
                    current_year_proj_other: stats.getNumberOfOther('current_projection'),
                    previous_year_other: stats.getNumberOfOther('prev_total')

                }
            }))
        })
    }

    public render() {
        return (
            <FileContainer>
                <Title name='Dashboard'/>
                <Loader loading={this.state.stats === undefined} emptyText={''} isEmpty={false}>
                    <div className='row'>
                        <div className='col-xl-6'>
                            <Summary yearlyStats={this.state.yearlyStats}/>
                        </div>
                        <div className='col-xl-6'>
                            <div className={'chart-group'}>
                                <MonthlyLineChart id={'month-12-unique-by-service'} className={'tall-chart'}
                                                  title={'Trailing 12 month unique visits by service'}
                                                  data={this.state.month12uniqueVisits}/>
                                <br/>
                                <Expander header={'Data Values'}>
                                    <DataTable data={this.state.month12uniqueVisits} monthly={true}/>
                                </Expander>
                            </div>
                        </div>
                        <div className='col-xl-6'>
                            <div className={'chart-group'}>
                                <MonthlyLineChart id={'month-12-total-by-service'} className={'tall-chart'}
                                                  title={'Trailing 12 month total visits by service'}
                                                  data={this.state.month12totalVisits}/>
                                <br/>
                                <Expander header={'Data Values'}>
                                    <DataTable data={this.state.month12totalVisits} monthly={true}/>
                                </Expander>
                            </div>
                        </div>

                        <div className='col-xl-6'>
                            <div className={'chart-group'}>
                                <MonthlyBarChart id={'month-12-intake'} className={'tall-chart'}
                                                 title={'Trailing 12 monthly new intake'}
                                                 data={this.state.filteredIntakeSeries}/> <br/>
                                <Expander header={'Data Values'}>
                                    <DataTable data={[this.state.filteredIntakeSeries]} monthly={true}/>
                                </Expander>
                            </div>
                        </div>

                        <div className='col-xl-6'>
                            <div className={'chart-group'}>
                                <MonthlyLineChart id={'day-30-day-shelter-gender'} className={'tall-chart'}
                                                 title={'Trailing 12 month Day Shelter visits by gender'}
                                                 data={this.state.month30dayShelterGender}/> <br/>
                                <Expander header={'Data Values'}>
                                    <DataTable data={this.state.month30dayShelterGender} monthly={true}/>
                                </Expander>
                            </div>
                        </div>

                        <div className='col-xl-12'>
                            <div className={'chart-group'}>
                                <DailyLineChart id={'day-30-usage'} className={'tall-chart'}
                                                title={'30 day service usage'}
                                                data={this.state.day30uniqueVisits}/><br/>
                                <Expander header={'30 day service usage values'}>
                                    <DataTable data={this.state.day30uniqueVisits} monthly={false}/>
                                </Expander>
                            </div>

                        </div>
                    </div>
                </Loader>
            </FileContainer>
        );
    }
}

export default connector(Dashboard)