import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import FileContainer from "../../components/app/FileContainer";
import {Title} from "../../components/app/Title";
import {Loader} from "../../components/app/loader/Loader";
import {LoadAllEvents} from "../../services/Event";
import BethsaidaEvent from "../../data/BethsaidaEvent";
import Service from "../../data/Service";
import {LoadAllServices} from "../../services/Service";


const mapStateToProps = (state: AppState) => ({
    eventState: state.eventState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        loadAllEvents: (updateFunc: (events: BethsaidaEvent[]) => void) => dispatch(LoadAllEvents(updateFunc)),
        loadAllServices: (updateFunc: (services: Service[]) => void) => dispatch(LoadAllServices(updateFunc))
    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
)
type PropsFromRedux = ConnectedProps<typeof connector>

// if we want to add in other props required for the tag that aren't part of the state
type Props = PropsFromRedux & {}

interface State {
    gridEvent: BethsaidaEvent[]
    loading: boolean
}

class AllEvents extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            gridEvent: [],
            loading: true
        }


    }

    componentDidMount(): void {
        this.props.loadAllEvents((s) => {
            this.setState(
                Object.assign({},
                    this.state,
                    {
                        gridEvent: s,
                        loading: false
                    }
                )
            )
        })

    }

    public render() {
        return (
            <FileContainer>
                <Title name='Event Management'>
                    <button type='button' className='btn btn-success form-control'
                            onClick={() => window.location.href = '/event/new'}>New Event
                    </button>
                </Title>
                <Loader loading={this.state.loading}>
                    {
                        (
                            () => {
                                if (this.state.gridEvent) {
                                    if (this.state.gridEvent.length === 0) {
                                        return <i>No events have been created yet.</i>
                                    } else {
                                        return (
                                            <table className='table table-bordered'>
                                                <thead className='thead-dark'>
                                                <tr>
                                                    <th>Event ID</th>
                                                    {/*<th>Type</th>*/}
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {this.state.gridEvent.map((s) => {
                                                    return (
                                                        <tr key={s.id} className='clickable-row' onClick={() => {
                                                            window.location.href = '/event/' + s.id;
                                                        }}>
                                                            <td className='align-content-center'>{s.id}</td>
                                                            {/*<td>{s.eventType.toString()}</td>*/}
                                                        </tr>)
                                                })}
                                                </tbody>
                                            </table>
                                        )

                                    }
                                } else {
                                    return <div/>
                                }
                            }
                        )()
                    }
                </Loader>
            </FileContainer>
        );
    }
}


export default connector(AllEvents)