import React from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import FileContainer from "../../components/app/FileContainer";
import {GetSummaryStats} from "../../services/Stats";
import SummaryStats from "../../data/SummaryStats";
import {Loader} from "../../components/app/loader/Loader";

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
                <Title name='Dashboard' />
                <Loader loading={this.state.stats === undefined} emptyText={''} isEmpty={false}>
                    <div className='row'>
                        <div className='col-md-4'>
                            <h2>Summary Statistics</h2>
                            <table className='table table-bordered table-hover'>
                                <tr><td>Number of Clients</td><td>{this.state.stats?.numClients}</td></tr>
                                <tr><td>Number of Unique Visits</td><td>{this.state.stats?.numUniqueVisits}</td></tr>
                                <tr><td>Number of Attendance Sheets</td><td>{this.state.stats?.numAttendanceSheets}</td></tr>
                            </table>
                        </div>
                        <div className='col-md-4'>
                            <h2>Today's Activity</h2>
                        </div>
                    </div>
                </Loader>
            </FileContainer>
        );
    }
}

export default connector(Dashboard)