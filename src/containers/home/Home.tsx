import React from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {Title} from "../../components/app/Title";
import FileContainer from "../../components/app/FileContainer";

const mapStateToProps = (state: AppState) => state

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {}
}


const connector = connect(
    mapStateToProps,
    mapDispatchToProps
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}

class Dashboard extends React.Component<Props> {

    public render() {
        return (
            <FileContainer>
                <Title name='Dashboard' />
                <div className='row'>
                    <div className='col-md-4'>
                        <h2>Summary Statistics</h2>
                    </div>
                    <div className='col-md-4'>
                        <h2>Today's Activity</h2>
                    </div>
                </div>
            </FileContainer>
        );
    }
}

export default connector(Dashboard)