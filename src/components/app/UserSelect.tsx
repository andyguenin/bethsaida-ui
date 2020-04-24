import React, {ChangeEvent, Fragment} from 'react';
import Client from "../../data/Client";
import Env from "../../environment/Env";
import {clientFilterFunc, clientSortFunc} from "../../util/ClientUtil";
import User from "../../data/User";
import {userFilterFunc, userSortFunc} from "../../util/UserUtil";


interface Props {
    id: string
    users: User[]
    action: (u?: User) => void
    selectedUser?: User
}

interface State {
    submenuOpen: boolean,
    text: string,
    usersToShow: User[]

}

export default class UserSelect extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            submenuOpen: false,
            text: '',
            usersToShow: []
        }
    }

    private singleRow = (u: User) => {
        return (
            <div key={'usersearch-' + u.id} className='autocomplete-item' onClick={() => this.props.action(u)}>
                {u.getFullName()}
            </div>
        )
    }

    private onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value
        if (text === '') {
            this.setState((state, props) =>
                Object.assign({},
                    state,
                    {
                        text,
                        submenuOpen: false
                    }
                )
            )
        } else {
            const visible = this.getVisibleList(text)
            this.setState((state, props) =>
                Object.assign({},
                    state,
                    {
                        text,
                        submenuOpen: visible.length !== 0,
                        usersToShow: visible
                    }
                )
            )
        }
    }

    private getVisibleList = (t: string) => {
        const a = userFilterFunc(t, this.props.users)
        return userSortFunc(a).slice(0, Math.min(a.length, 5))
    }


    render(): React.ReactNode {
        if(this.props.selectedUser === undefined) {
            return (
                <div className={'autocomplete'}
                     onBlur={(e) => {
                         setTimeout(() =>
                                 this.setState((state, props) => Object.assign({}, state, {submenuOpen: false})),
                             200
                         )
                     }
                     }
                >
                    <input
                        id={'clientselect-' + this.props.id}
                        type='text'
                        className='form-control'
                        onChange={this.onChange}
                        placeholder='Employee'
                        value={this.state.text}
                    />
                    <div className={'autocomplete-items ' + (this.state.submenuOpen ? '' : 'd-none')}>
                        {this.state.usersToShow.map(this.singleRow)}
                    </div>
                </div>
            )
        } else {
            return <div className='input-group'>
                <input className='form-control disabled' disabled={true}
                       value={this.props.selectedUser.getFullName()}
                />
                <div className='input-group-append'>
                    <div className='input-group-text pointer' onClick={
                        () => {
                            this.setState((state, props) => Object.assign({}, state, {text: ''}),
                                () => this.props.action(undefined)
                            )
                        }
                    }>Clear
                    </div>
                </div>
            </div>
        }
    }
}
