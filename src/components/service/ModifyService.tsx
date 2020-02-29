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

    private handleSubmit(): (e: FormEvent<HTMLFormElement>) => void {
        return (e) => {
            e.preventDefault();
            this.setDisabledState(true)
            if(this.props.submitAction(this.state.service)) {
                this.setDisabledState(false)
            }
        }
    }

    private handleTextUpdate(field: string): (e: ChangeEvent<HTMLInputElement>) => void {
        return (e) => {
            const newState: State = Object.assign({}, this.state, {client: this.state.service.setField(field, e.target.value)});
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
                                   value={this.state.service.name()}
                                   onChange={this.handleTextUpdate('name')}
                                   autoComplete="off"
                                   required={true}
                            />
                        </div>
                        {/*<div className='form-group row'>*/}
                        {/*    <label htmlFor='serviceType' className='col-sm-2'>Type</label>*/}
                        {/*    <div className='form-check form-check-inline'>*/}
                        {/*        <input*/}
                        {/*            required={true}*/}
                        {/*            type='radio'*/}
                        {/*            id='recurring'*/}
                        {/*            name='serviceType'*/}
                        {/*            className='form-check-input'*/}
                        {/*            value={ServiceType.RECURRING}*/}
                        {/*            onChange={this.handleTextUpdate('serviceType')}*/}
                        {/*            checked={this.state.service.serviceType() === ServiceType.RECURRING}*/}
                        {/*        />*/}
                        {/*        <label htmlFor='recurring' className='form-check-label'>Recurring</label>*/}
                        {/*    </div>*/}
                        {/*    <div className='form-check form-check-inline'>*/}
                        {/*        <input*/}
                        {/*            required={true}*/}
                        {/*            type='radio'*/}
                        {/*            id='single'*/}
                        {/*            name='serviceType'*/}
                        {/*            className='form-check-input'*/}
                        {/*            value={ServiceType.SINGLE}*/}
                        {/*            onChange={this.handleTextUpdate('serviceType')}*/}
                        {/*            checked={this.state.service.serviceType() === ServiceType.SINGLE}*/}
                        {/*        />*/}
                        {/*        <label htmlFor='single' className='form-check-label'>Single</label>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div className='form-group row'>
                            <label htmlFor='capacity' className='col-sm-2'>Capacity</label>
                            <input type='text' inputMode='numeric' pattern="[0-9]*"
                                   className='form-control col-sm-10'
                                   id='service_name'
                                   placeholder='Capacity (leave blank for unspecified capacity)'
                                   value={this.state.service.defaultCapacity() === -1 ? '' : this.state.service.defaultCapacity()}
                                   // value=''
                                   onChange={this.handleTextUpdate('defaultCapacity')}
                                   autoComplete="off"
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