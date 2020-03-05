import React, {ChangeEvent, FormEvent, Fragment} from 'react';
import ClientBuilder from "../../data/ClientBuilder";
import {Race} from "../../data/Race";
import {Gender} from "../../data/Gender";
import Env from "../../environment/Env";
import {DeleteImage, UploadImage} from "../../services/Client";
import {Loader} from "../app/loader/Loader";


interface IProps {
    clientBuilder: ClientBuilder
    submitText: string
    cancelAction: () => void
    submitAction: (c: ClientBuilder) => boolean
}

interface IState {
    client: ClientBuilder
    disableInputs: boolean
    errorState?: object
    imageLoading?: object
}

export class ModifyClient extends React.Component<IProps, IState> {

    private generateDefaultState(builder: ClientBuilder): IState {
        return ({
            client: builder,
            disableInputs: false
        })
    }

    constructor(props: IProps) {
        super(props);
        this.handleImageUpdate = this.handleImageUpdate.bind(this);
        this.handleTextUpdate = this.handleTextUpdate.bind(this);

        this.state = this.generateDefaultState(props.clientBuilder);

        console.log(props.clientBuilder);


    }

    private isIdLoading = (id: string): boolean => {
        return this.state.imageLoading !== undefined
            && (this.state.imageLoading as any)[id] !== undefined
            && ((this.state.imageLoading as any)[id] as boolean);
    }

    private setIdLoading = (id: string, isLoading: boolean): void => {
        let idLoading: any = {};
        idLoading[id] = isLoading;
        const imageLoading = Object.assign({}, this.state.imageLoading, idLoading);

        this.setState(Object.assign(
            {},
            this.state,
            {
                imageLoading: imageLoading
            }
        ))
    };



    private setButtonDisable(): (disable: boolean) => void {
        return (d) => {
            this.setState(Object.assign({}, {disableInputs: d}));
        }
    }

    private handleImageStateUpdate = (id: string, imageTag?: string): void => {
        this.setState(
            Object.assign(
                {},
                this.state,
                {
                    client: this.state.client.setField(id, imageTag || '')
                }
            )
        )

    }


    private handleImageUpdate(id: string): (e: ChangeEvent<HTMLInputElement>) => void {
        return (e) => {
            console.log(this.state.client);
            if (e.target && e.target.files) {
                this.setIdLoading(id, true)
                UploadImage(e.target.files[0], (img) => {
                        this.handleImageStateUpdate(id, img);
                        this.setIdLoading(id, false)
                    },
                    (message: string) => {
                        this.handleImageStateUpdate(id, undefined);
                        this.setIdLoading(id, false)
                    })
            }
        }
    }

    private displayImage = (label: string, id: string) => {
        const upload = (
            <Loader
                loading={this.isIdLoading(id)}
                emptyText='No client photo'
                isEmpty={this.state.client === undefined}
            >
                <input type='file' className='form-inline form-control' id={id}
                   onChange={this.handleImageUpdate(id)}/>
            </Loader>
        )

        const displayImage = (file: string, name: string, id: string) => {
            return (
                <Fragment>
                    <div className='row'>
                        <img id={'photo-preview-' + id} src={Env.get().imageUrl + '/' + file + '_400.png'}
                             alt={'photo of ' + name}/>
                    </div>
                    <div className='row remove-button'>
                        <button className='btn btn-success form-control'
                                onClick={() => DeleteImage(file, () => {
                                    this.handleImageStateUpdate(id, undefined);
                                })} type='button'>Remove Image
                        </button>
                    </div>
                </Fragment>
            );
        };

        return (
            <div className='col-sm-6'>
                <div className='row image-group'>
                    <label htmlFor={id} className='col-sm-4'>{label}</label>
                    <div className='col-sm-8'>
                        {
                            (() => {
                                    const fileName = this.state.client.getImageById(id);
                                    if (fileName !== undefined) {
                                        return displayImage(fileName, this.state.client.firstName || '', id)
                                    } else {
                                        return upload;
                                    }
                                }
                            )()
                        }
                    </div>
                </div>
            </div>
        )

    }

    private handleSubmit(): (e: FormEvent<HTMLFormElement>) => void {
        return (e) => {
            e.preventDefault();
            this.setButtonDisable()(true);
            if (this.props.submitAction(this.state.client)) {
                this.setButtonDisable()(false)
            }


        }
    }

    private handleTextUpdate(field: string): (e: ChangeEvent<HTMLInputElement>) => void {
        return (e) => {
            console.log(this.state.client)
            const newState: IState = Object.assign({}, this.state, {client: this.state.client.setField(field, e.target.value)});
            this.setState(newState);
        }
    }

    render() {
        return (
            <div className='row'>
                <div className='offset-1 col-10'>
                    <form onSubmit={this.handleSubmit()}>
                        <div className='form-group row'>
                            <label htmlFor='first_name' className='col-sm-2'>First Name</label>
                            <input type='text'
                                   className='form-control col-sm-10'
                                   id='first_name'
                                   placeholder='First Name'
                                   value={this.state.client.firstName}
                                   onChange={this.handleTextUpdate('firstName')}
                                   autoComplete="off"
                                   required={true}
                            />
                        </div>
                        <div className='form-group row'>
                            <label htmlFor='middle_name' className='col-sm-2'>Middle Name</label>
                            <input type='text' className='form-control col-sm-10' id='middle_name'
                                   placeholder='Middle Name'
                                   value={this.state.client.middleName}
                                   onChange={this.handleTextUpdate('middleName')}
                                   autoComplete="off"
                            />
                        </div>
                        <div className='form-group row'>
                            <label htmlFor='last_name' className='col-sm-2'>Last Name</label>
                            <input type='text' className='form-control col-sm-10' id='last_name'
                                   placeholder='Last Name'
                                   value={this.state.client?.lastName}
                                   onChange={this.handleTextUpdate('lastName')}
                                   autoComplete="off"
                                   required={true}
                            />
                        </div>
                        <div className='form-group row'>
                            <label htmlFor='date_of_birth' className='col-sm-2'>Date of Birth</label>
                            <input type='date' className='form-control col-sm-10' id='dob'
                                   value={this.state.client?.dateOfBirth}
                                   onChange={this.handleTextUpdate('dateOfBirth')}
                                   required={true}
                            />
                        </div>
                        <div className='form-group row'>
                            <label htmlFor='gender' className='col-sm-2'>Gender</label>
                            <div className='form-check form-check-inline'>
                                <input
                                    required={true}
                                    type='radio'
                                    id='male'
                                    name='gender'
                                    className='form-check-input'
                                    value={Gender.MALE}
                                    onChange={this.handleTextUpdate('gender')}
                                    checked={this.state.client.gender === Gender.MALE}
                                />
                                <label htmlFor='male' className='form-check-label'>Male</label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <input
                                    required={true}
                                    type='radio'
                                    id='female'
                                    name='gender'
                                    className='form-check-input'
                                    value={Gender.FEMALE}
                                    onChange={this.handleTextUpdate('gender')}
                                    checked={this.state.client.gender === Gender.FEMALE}
                                />
                                <label htmlFor='female' className='form-check-label'>Female</label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <input
                                    required={true}
                                    type='radio'
                                    id='other'
                                    name='gender'
                                    className='form-check-input'
                                    value={Gender.OTHER}
                                    onChange={this.handleTextUpdate('gender')}
                                    checked={this.state.client.gender === Gender.OTHER}
                                />
                                <label htmlFor='other' className='form-check-label'>Other</label>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label htmlFor='race' className='col-sm-2'>Race</label>
                            <div className='form-check form-check-inline'>
                                <input
                                    required={true}
                                    type='radio'
                                    id='nonwhite'
                                    name='race'
                                    className='form-check-input'
                                    value={Race.NONWHITE}
                                    onChange={this.handleTextUpdate('race')}
                                    checked={this.state.client.race === Race.NONWHITE}
                                />
                                <label htmlFor='nonwhite' className='form-check-label'>Non-White</label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <input
                                    required={true}
                                    type='radio'
                                    id='white'
                                    name='race'
                                    className='form-check-input'
                                    value={Race.WHITE}
                                    onChange={this.handleTextUpdate('race')}
                                    checked={this.state.client.race === Race.WHITE}
                                />
                                <label htmlFor='white' className='form-check-label'>White</label>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label htmlFor='phone' className='col-sm-2'>Phone</label>
                            <input type='text' inputMode='numeric' pattern="[0-9 \-\(\)]*"
                                   className='form-control col-sm-10' id='phone'
                                   value={this.state.client.phone}
                                   onChange={this.handleTextUpdate('phone')}/>
                        </div>
                        <div className='form-group row'>
                            {this.displayImage("Client Photo", "clientPhoto")}
                            {/*</div>*/}
                            {/*<div className='form-group row'>*/}
                            {this.displayImage("Photo ID", "photoId")}
                        </div>
                        <div className='form-group row'>
                            <label htmlFor='intake_date' className='col-sm-2'>Intake date</label>
                            <input type='date' className='form-control col-sm-10' id='intake_date'
                                   value={this.state.client?.intakeDate}
                                   onChange={this.handleTextUpdate('intakeDate')}
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
        )
    }
}

