import React from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import FileContainer from "../../components/app/FileContainer";
import {GetSummaryStats} from "../../services/Stats";
import SummaryStats from "../../data/SummaryStats";
import {Loader} from "../../components/app/loader/Loader";
import Chart from "../../components/app/Chart";
import Series from "../../data/chart/Series";
import DatePoint from "../../data/chart/DatePoint";
import {Chart2} from "../../components/app/Chart2";

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
}

class Dashboard extends React.Component<Props, State> {

    generateSeries = () => {

        let dates: Date[] = [];
        for (let i = 0; i < 30; ++i) {
            dates.push(new Date(2020, 0, i + 1))
        }
        let l: any = {'Day Shelter': [40, 50], 'Night Shelter': [30, 40], 'Showers': [10, 20]}
        const series = ['Day Shelter', 'Night Shelter', 'Showers']
        const a = series.map(s => {
            const range = l[s]
            const min = range[0]
            const max = range[1]
            return new Series(s,
                dates.map(date => {
                    return new DatePoint(date, Math.random() * (max - min) + min)
                })
            )
        })
        return a;
    }

    constructor(props: Props) {
        super(props);
        this.state = {}
        this.props.summaryStats(stats => {
            this.setState(Object.assign({}, this.state, {stats}))
        })
    }

    public render() {
        return (
            <FileContainer>
                <Title name='Dashboard'/>
                <Loader loading={this.state.stats === undefined} emptyText={''} isEmpty={false}>
                    <div className='row'>
                        <div className='col-12'>
                            <Chart2 id={'abc'} className={'tall-chart'} data={this.generateSeries()}/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <Chart2 id={'def'} data={this.generateSeries()}/>
                        </div>
                    </div>
                </Loader>
            </FileContainer>
        );
    }
}

export default connector(Dashboard)