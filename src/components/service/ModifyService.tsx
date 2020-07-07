import React, {ChangeEvent, FormEvent} from 'react';
import ServiceBuilder from "../../data/ServiceBuilder";
import {ServiceType} from "../../data/ServiceType";


interface Props {
    service: ServiceBuilder;
    submitText: string
    cancelAction: () => void
    submitAction: (c: ServiceBuilder) => boolean
}

interface State {
    service: ServiceBuilder
    disableInputs: boolean
}

export default class ModifyService extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            service: props.service,
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

    private handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        this.setDisabledState(true)
        if (this.props.submitAction(this.state.service)) {
            this.setDisabledState(false)
        }
    }

    private handleTextUpdate(field: string): (e: ChangeEvent<HTMLInputElement>) => void {
        return (e) => {
            const newState: State = Object.assign({}, this.state, {service: this.state.service.setField(field, e.target.value)});
            this.setState(newState);
        }
    }

    render() {
        return (
            <div className='row'>
                <div className='offset-1 col-10'>
                    <form onSubmit={this.handleSubmit}>
                        <div className='form-group row'>
                            <label htmlFor='service_name' className='col-sm-2'>Service Name</label>
                            <input type='text'
                                   className='form-control col-sm-10'
                                   id='service_name'
                                   placeholder='Service Name'
                                   value={this.state.service.name()}
                                   onChange={this.handleTextUpdate('name')}
                                   autoComplete="off"
                                   required={true}
                            />
                        </div>
                        <div className='form-group row'>
                            <label htmlFor='serviceType' className='col-sm-2'>Type</label>
                            <div className='form-check form-check-inline'>
                                <input
                                    required={true}
                                    type='radio'
                                    id='shelter'
                                    name='serviceType'
                                    className='form-check-input'
                                    value={ServiceType.SHELTER}
                                    onChange={this.handleTextUpdate('serviceType')}
                                    checked={this.state.service.serviceType() === ServiceType.SHELTER}
                                />
                                <label htmlFor='shelter' className='form-check-label'>Shelter</label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <input
                                    required={true}
                                    type='radio'
                                    id='shower'
                                    name='serviceType'
                                    className='form-check-input'
                                    value={ServiceType.SHOWER}
                                    onChange={this.handleTextUpdate('serviceType')}
                                    checked={this.state.service.serviceType() === ServiceType.SHOWER}
                                />
                                <label htmlFor='shower' className='form-check-label'>Shower</label>
                            </div>
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