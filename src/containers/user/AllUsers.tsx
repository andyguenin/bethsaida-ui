import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import FileContainer from "../../components/app/FileContainer";
import {Title} from "../../components/app/Title";
import {LoadAllServices} from "../../services/Service";
import Service from "../../data/Service";
import {Loader} from "../../components/app/loader/Loader";
import User from "../../data/User";
import {LoadAllUsers} from "../../services/User";


const mapStateToProps = (state: AppState) => ({
    serviceState: state.serviceState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        loadAllUsers: (updateFunc: (users: User[]) => void) => dispatch(LoadAllUsers(updateFunc))
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
    users: User[]
    loading: boolean
}

class AllUsers extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            users: [],
            loading: true
        }


    }

    componentDidMount(): void {
        this.props.loadAllUsers((s) => {
            this.setState(
                Object.assign({},
                    this.state,
                    {
                        users: s.sort((a, b) => a.name.localeCompare(b.name)),
                        loading: false
                    }
                )
            )
        })

    }

    public render() {
        return (
            <FileContainer>
                <Title name='Employee Management'>
                    <button type='button' className='btn btn-success form-control'
                            onClick={() => window.location.href = '/user/new'}>New Employee
                    </button>
                </Title>
                <Loader
                    loading={this.state.loading}
                    isEmpty={this.state.users.length === 0}
                    emptyText='No users have been created yet.'
                >

                    <table className='table table-bordered table-hover'>
                        <thead className='thead-dark'>
                        <tr>
                            <th>Employee Name</th>
                            <th>Email</th>
                            <th>Confirmed</th>
                            <th>Admin</th>
                            <th>Account Create Date</th>
                            <th>Latest Activity</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.users.map((s) => {
                            return (
                                <tr key={s.id} className='clickable-row' onClick={() => {
                                    window.location.href = '/user/' + s.id;
                                }}>
                                    <td className=''>{s.name}</td>
                                    <td className=''>{s.email}</td>
                                    <td>{s.confirmed ? "✓ YES" : 'x NO'}</td>
                                    <td>{s.admin ? "✓ YES" : 'x NO'}</td>
                                    <td>{s.createTime.toLocaleString()}</td>
                                    <td>{s.latestActivity.toLocaleString()}</td>

                                </tr>)
                        })}
                        </tbody>
                    </table>
                </Loader>
            </FileContainer>
        );
    }
}


export default connector(AllUsers)