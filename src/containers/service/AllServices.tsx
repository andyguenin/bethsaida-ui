import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import FileContainer from "../../components/app/FileContainer";
import {Title} from "../../components/app/Title";
import {GetAllServices} from "../../services/Service";
import Service from "../../data/Service";
import {Loader} from "../../components/app/loader/Loader";


const mapStateToProps = (state: AppState) => ({
    serviceState: state.serviceState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        loadAllServices: (updateFunc: (services: Service[]) => void) => dispatch(GetAllServices(updateFunc))
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
    gridService: Service[]
    loading: boolean
}

class AllServices extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            gridService: [],
            loading: true
        }


    }

    componentDidMount(): void {
        this.props.loadAllServices((s) => {
            this.setState(
                Object.assign({},
                    this.state,
                    {
                        gridService: s.sort((a, b) => a.name.localeCompare(b.name)),
                        loading: false
                    }
                )
            )
        })

    }

    public render() {
        return (
            <FileContainer>
                <Title name='Service Management'>
                    <button type='button' className='btn btn-success form-control'
                            onClick={() => window.location.href = '/service/new'}>New Service
                    </button>
                </Title>
                <Loader
                    loading={this.state.loading}
                    isEmpty={this.state.gridService.length === 0}
                    emptyText='No services have been created yet.'
                >

                    <table className='table table-bordered table-hover'>
                        <thead className='thead-dark'>
                        <tr>
                            <th>Service Name</th>
                            {/*<th>Type</th>*/}
                            <th>Maximum Capacity</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.gridService.map((s) => {
                            return (
                                <tr key={s.id} className='clickable-row' onClick={() => {
                                    window.location.href = '/service/' + s.id;
                                }}>
                                    <td className='align-content-center'>{s.name}</td>
                                    {/*<td>{s.serviceType.toString()}</td>*/}
                                    <td>{s.defaultCapacity === undefined || s.defaultCapacity === 0 ? '-' : s.defaultCapacity}</td>

                                </tr>)
                        })}
                        </tbody>
                    </table>
                </Loader>
            </FileContainer>
        );
    }
}


export default connector(AllServices)