import React, {ChangeEvent, FormEvent} from 'react';
import ServiceBuilder from "../../data/ServiceBuilder";
import {ServiceType} from "../../data/ServiceType";
import BethsaidaEventBuilder from "../../data/BethsaidaEventBuilder";
import Service from "../../data/Service";
import {LoadAllServices, LoadAllServices2} from "../../services/Service";
import {Loader} from "../app/loader/Loader";


interface Props {
    event: BethsaidaEventBuilder
    submitText: string
    cancelAction: () => void
    submitAction: (c: BethsaidaEventBuilder) => boolean
}

interface State {
    event: BethsaidaEventBuilder
    services: Service[]
    disableInputs: boolean
    capacityChanged: boolean
    loading: boolean
}

export default class ModifyEvent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            event: props.event,
            services: [],
            disableInputs: false,
            capacityChanged: false,
            loading: true
        }
    }

    componentDidMount(): void {
        LoadAllServices2((c) => {
            this.setState(
                Object.assign(
                    {},
                    this.state,
                    {
                        services: c,
                        loading: false
                    }
                )
            )
        }, (m) => undefined)
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
            if (this.props.submitAction(this.state.event)) {
                this.setDisabledState(false)
            }
        }
    }

    private getCapacityForEventById = (id?: string): number => {
        if (id === undefined) {
            return 0;
        } else {
            const found = this.state.services.find((s) => s.id === this.state.event.serviceId())
            if (found === undefined) {
                return 0;
            } else {
                if (found.defaultCapacity === undefined) {
                    return 0;
                } else {
                    return found.defaultCapacity;
                }
            }
        }
    }


    private handleServiceNameUpdate = (e: ChangeEvent<HTMLSelectElement>): void => {
        const newEvent =
            this.state.event
                .setServiceId(e.target.value)

        const eventTransform =
            this.state.capacityChanged ?
                (e: BethsaidaEventBuilder) => e :
                (e: BethsaidaEventBuilder) => e.setCapacity(this.getCapacityForEventById(this.state.event.serviceId()).toString());
        const state = Object.assign({}, this.state, {event: eventTransform(newEvent)});
        this.setState(state);
    }


    private handleTextUpdate(field: string): (e: ChangeEvent<HTMLInputElement>) => void {
        return (e) => {
            const newState: State = Object.assign({}, this.state, {event: this.state.event.setField(field, e.target.value)});
            this.setState(newState);
        }
    }

    private serviceSelect = (service: Service) => {
        return (
            <option key={service.id} value={service.id}>{service.name}</option>
        )
    }

    render() {
        return (
            <div className='row'>
                <div className='offset-1 col-10'>
                    <Loader loading={this.state.loading} emptyText='' isEmpty={false}>
                        <form onSubmit={this.handleSubmit()}>
                            <div className='form-group row'>
                                <label htmlFor='service_name' className='col-sm-2'>Service Name</label>
                                {/*<input type='text'*/}
                                {/*       className='form-control col-sm-10'*/}
                                {/*       id='service_name'*/}
                                {/*       placeholder='Service Name'*/}
                                {/*       value={this.state.events.id()}*/}
                                {/*       onChange={this.handleTextUpdate('name')}*/}
                                {/*       autoComplete="off"*/}
                                {/*       required={true}*/}
                                {/*/>*/}

                                <div className='col-sm-10'>
                                    <select className='form-control'
                                            value={this.state.event.serviceId() || 'x1'}
                                            onChange={this.handleServiceNameUpdate}
                                    >
                                        <option value={'x1'}>Please choose an option</option>
                                        <option value={'x2'}>-----------------------</option>
                                        {this.state.services.map(this.serviceSelect)}
                                    </select>
                                </div>
                            </div>
                            <div className='form-group row'>
                                <label htmlFor='capacity' className='col-sm-2'>Capacity</label>
                                <input type='text' inputMode='numeric' pattern="[0-9]*"
                                       className='form-control col-sm-10'
                                       id='service_name'
                                       placeholder='Capacity (leave blank for unspecified capacity)'
                                       value={this.state.event.capacity() === 0 ? '' : this.state.event.capacity()}
                                       onChange={this.handleTextUpdate('capacity')}
                                       autoComplete="off"
                                />
                            </div>
                            <div className='form-group row'>
                                <label htmlFor='intake_date' className='col-sm-2'>Event Date</label>
                                <input type='date' className='form-control col-sm-10' id='date'
                                       value={this.state.event?.getDate()}
                                       onChange={this.handleTextUpdate('date')}
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
                    </Loader>
                </div>
            </div>
        );
    }
}