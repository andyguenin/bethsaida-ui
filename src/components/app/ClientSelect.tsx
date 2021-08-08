import React, {ChangeEvent, Fragment} from 'react';
import Client from "../../data/Client";
import Env from "../../environment/Env";
import {clientFilterFunc, clientSortFunc} from "../../util/ClientUtil";


interface Props {
    id: string
    clients: Client[]
    action: (c?: Client) => void
    selectedClient?: Client
}

interface State {
    submenuOpen: boolean,
    text: string,
    clientsToShow: Client[]

}

export default class ClientSelect extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            submenuOpen: false,
            text: '',
            clientsToShow: []
        }
    }

    private singleRow = (c: Client) => {
        return (
            <div key={'clientsearch-' + c.id} className='autocomplete-item' onClick={() => this.props.action(c)}>
                {c.smallImageTag()}
                &nbsp;&nbsp;&nbsp;
                <div className='client-name'>{c.fullName}</div>
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
                        clientsToShow: visible
                    }
                )
            )
        }
    }

    private getVisibleList = (t: string) => {
        const a = clientFilterFunc(t, this.props.clients)
        return clientSortFunc(a).slice(0, Math.min(a.length, 5))
    }


    render(): React.ReactNode {
        if (this.props.selectedClient === undefined) {
            return <div className={'autocomplete'}
                        onBlur={(e) => {
                            setTimeout(() =>
                                    this.setState((state, props) => Object.assign({}, state, {submenuOpen: false})),
                                200
                            )
                        }
                        }
                        id={this.props.id + '-div'}
            >
                <input
                    id={this.props.id + '-input'}
                    type='text'
                    className='form-control'
                    onChange={this.onChange}
                    placeholder='Client'
                    value={this.state.text}
                />
                <div className={'autocomplete-items ' + (this.state.submenuOpen ? '' : 'd-none')}>
                    {this.state.clientsToShow.map(this.singleRow)}
                </div>
            </div>
        } else {
            return <div className='input-group'>
                <input className='form-control disabled' disabled={true}
                       value={this.props.selectedClient.fullName}
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
