import React, {ChangeEvent, FormEvent} from 'react';
import ServiceBuilder from "../../data/ServiceBuilder";
import {ServiceType} from "../../data/ServiceType";
import BethsaidaEventBuilder from "../../data/BethsaidaEventBuilder";


interface Props {
    event: BethsaidaEventBuilder;
    submitText: string
    cancelAction: () => void
    submitAction: (c: BethsaidaEventBuilder) => boolean
}

interface State {
    event: BethsaidaEventBuilder
    disableInputs: boolean
}

export default class ModifyEvent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            event: props.event,
            disableInputs: false
        }
    }

    private setDisabledState = (disabled: boolean): void => {
        this.setState(Object.assign(
            {},
            this.state,
            {disabledInputs: disabled}
        ))
    }

    private handleSubmit(): (e: FormEvent<HTMLFormElement>) => void {
        return (e) => {
            e.preventDefault();
            this.setDisabledState(true)
            if(this.props.submitAction(this.state.event)) {
                this.setDisabledState(false)
            }
        }
    }

    private handleTextUpdate(field: string): (e: ChangeEvent<HTMLInputElement>) => void {
        return (e) => {
            const newState: State = Object.assign({}, this.state, {client: this.state.event.setField(field, e.target.value)});
            this.setState(newState);
        }
    }

    render() {
        return (
            <div className='row'>
                <div className='offset-1 col-10'>
                    <form onSubmit={this.handleSubmit()}>
                        <div className='form-group row'>
                            <label htmlFor='service_name' className='col-sm-2'>Service Name</label>
                            <input type='text'
                                   className='form-control col-sm-10'
                                   id='service_name'
                                   placeholder='Service Name'
                                   value={this.state.event.id()}
                                   onChange={this.handleTextUpdate('name')}
                                   autoComplete="off"
                                   required={true}
                            />
                        </div>
                        <div className="form-group row">
                            <div className='offset-sm-3 col-sm-3'>
                                <button
                                    type='button'
                                    className="btn btn-danger"
                                    onClick={this.props.cancelAction}
                                    disabled={this.state.disableInputs}
                                >
                                    Cancel Changes
                                </button>
                            </div>
                            <div className="col-sm-3">
                                <button
                                    className="btn btn-primary"
                                    disabled={this.state.disableInputs}
                                    type='submit'
                                >{this.props.submitText}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}