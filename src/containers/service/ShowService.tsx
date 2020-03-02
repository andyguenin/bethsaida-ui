import React, {Fragment} from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {withRouter, RouteChildrenProps} from 'react-router-dom'
import FileContainer from "../../components/app/FileContainer";
import {Title} from "../../components/app/Title";
import Service from "../../data/Service";
import {Loader} from "../../components/app/loader/Loader";
import {DeleteService, GetSingleService} from "../../services/Service";
import Credentials from "../../data/Credentials";

const mapStateToProps = (state: AppState) => ({
    serviceState: state.serviceState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        getSingleService: (id: string, action: (s: Service) => void) => dispatch(GetSingleService(id, action)),
        deleteService: (id: string, action: (s: string) => void) => DeleteService(id, action)
    };
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

interface RouteProps {
    id: string
}

interface IState {
    loading: boolean
    service?: Service
}

type Props = PropsFromRedux & RouteChildrenProps<RouteProps>

class ShowService extends React.Component<Props, IState> {

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: true,
            service: undefined
        }

    }

    componentDidMount(): void {
        if (this.props.match?.params) {
            this.props.getSingleService(this.props.match?.params.id, (service: Service) => {
                this.setState({
                    service: service,
                    loading: false
                })

            })
        }
    }

    render() {
        return (
            <FileContainer>
                <Loader
                    loading={this.state.loading}
                    isEmpty={this.state.service === undefined}
                    emptyText='Canont find service'
                >

                    <Fragment>
                        <Title name={this.state.service?.name}>
                            <button
                                className='btn btn-success form-control'
                                type='button'
                                onClick={() => window.location.href = '/service/' + (this.state.service?.id || '') + '/edit'}>
                                Edit
                            </button>
                            {
                                (
                                    () => {
                                        if(new Credentials().getDisplayAdmin()) {
                                            return <button
                                                className={'btn btn-danger form-control ' + (new Credentials().getDisplayAdmin() ? '' : 'hide')}
                                                type='button'
                                                onClick={() => {
                                                    const confirm = window.confirm("Are you sure you want to delete this service?");
                                                    if(confirm && this.state.service !== undefined && this.state.service.id !== undefined) {
                                                        this.props.deleteService(this.state.service?.id, (i) => {
                                                            window.location.href = '/client'
                                                        })
                                                    }
                                                }}>
                                                Delete
                                            </button>
                                        } else {
                                            return (<Fragment />)
                                        }
                                    }
                                )()
                            }
                        </Title>
                        <div className='row'>
                            <div className='col-md-3'>
                                <table className='table table-bordered'>
                                    <thead className='thead-dark'>
                                    <tr>
                                        <th>Attribute</th>
                                        <th className='text-right'>Value</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {/*<tr>*/}
                                    {/*    <td>Service Type</td>*/}
                                    {/*    <td className='text-right'>{this.state.service?.serviceType.toString()}</td>*/}
                                    {/*</tr>*/}
                                    <tr>
                                        <td>Default Capacity</td>
                                        <td className='text-right'>{
                                            this.state.service?.defaultCapacity === undefined || this.state.service?.defaultCapacity == 0 ?
                                                'Unlimited'
                                                : this.state.service.defaultCapacity}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Fragment>

                </Loader>
            </FileContainer>
        )
    }
}

export default withRouter(connector(ShowService))