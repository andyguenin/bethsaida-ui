import React, {Fragment} from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {GetSingleClient} from "../../services/Client";
import {withRouter, RouteChildrenProps} from 'react-router-dom'
import FileContainer from "../../components/app/FileContainer";
import Client from "../../data/Client";
import Env from "../../environment/Env";
import DateUtil from "../../util/DateUtil";
import {Race} from "../../data/Race";
import {Gender} from "../../data/Gender";
import {Title} from "../../components/app/Title";
import Service from "../../data/Service";
import {Loader} from "../../components/app/loader/Loader";
import {GetSingleService} from "../../services/Service";

const mapStateToProps = (state: AppState) => ({
    serviceState: state.serviceState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        getSingleService: (id: string, action: (c: Service) => void) => dispatch(GetSingleService(id, action))
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
                <Loader loading={this.state.loading}>
                    {
                        (() => {
                            if (this.state.service !== undefined) {
                                console.log(this.state.service)
                                return (
                                    <Fragment>
                                    <Title name={this.state.service?.name}>
                                        <button
                                            className='btn btn-success form-control'
                                            type='button'
                                            onClick={() => window.location.href='/service/' + (this.state.service?.id || '') + '/edit'}>
                                            Edit</button>
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

                                )
                            } else {
                                return (<div></div>);
                            }
                        })()
                    }
                </Loader>
            </FileContainer>
        )
    }
}

export default withRouter(connector(ShowService))