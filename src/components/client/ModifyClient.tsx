import React, {ChangeEvent, Fragment} from 'react';
import Client from "../../data/Client";
import ClientBuilder from "../../data/ClientBuilder";


interface IProps {
    client?: Client
    cancelAction: () => void
}

interface IPhotoState {
    id: string,
    deleteImage?: boolean
    file?: string
}

interface IState {
    clientPhoto: IPhotoState
    photoId: IPhotoState
    getPhotoById(id: string): IPhotoState
    client: ClientBuilder
}

export class ModifyClient extends React.Component<IProps, IState> {
    private defaultState: IState = {
        clientPhoto: {
            id: "clientPhoto",
            file: undefined,
            deleteImage: undefined
        },
        photoId: {
            id: "photoId",
            file: undefined,
            deleteImage: undefined
        },
        getPhotoById(id: string): IPhotoState {
            if (id === "clientPhoto") {
                return this.clientPhoto;
            } else if (id === "photoId") {
                return this.photoId
            } else {
                throw new RangeError("id " + id + " not found")
            }
        },
        client: new ClientBuilder()
    }

    constructor(props: IProps) {
        super(props);

        this.handleUpdate = this.handleUpdate.bind(this)
        this.state = this.defaultState;
    }

    static defaultProps = {
        newClient: true,
        client: undefined
    };

    private newState(id: string, newPhotoState: IPhotoState): IState {
        let retObj: any = {};
        retObj[id] = Object.assign({}, this.state.getPhotoById(id), newPhotoState);
        return Object.assign({}, this.state, retObj);
    }

    private handleUpdate(id: string): (e: ChangeEvent<HTMLInputElement>) => void {
        return (e) => {
            if (e.target && e.target.files) {
                this.setState(this.newState(id, {id: id, deleteImage: false, file: URL.createObjectURL(e.target.files[0])}));
            }
        }
    }

    private displayImage(id: string) {
        const upload = <input type='file' className='form-control col-sm-4' id={id}
                              onChange={this.handleUpdate(id)}/>


        const state = this.state.getPhotoById(id);
        const displayImage = (file: string, name: string, id: string) => {
            return (
                <div className='col-sm-6 uploaded-image'>
                    <img id={'photo-preview-' + id} src={file}
                         alt={'photo of ' + name}/>
                    <button type='button' className='btn btn-info reupload' onClick={() => {

                        this.setState(this.newState(id, {id: id, file: undefined, deleteImage: true}))}}>Delete Image</button>
                </div>);
        };

        if (state.file) {
            return displayImage(state.file, this.props.client?.fullName || '', id);
        } else {
            if(this.props.client?.clientPhoto && !state.deleteImage) {
                return displayImage(this.props.client.clientPhoto, this.props.client.fullName || '', id);
            } else {
                return upload;
            }
        }
    }

    render() {
        console.log(this);
        return (
            <Fragment>
                <div>client: {JSON.stringify(this.state.client)}</div>
                <div className='row'>
                    <div className='offset-1 col-10'>
                        <form>
                            <div className='form-group row'>
                                <label htmlFor='first_name' className='col-sm-2'>First Name</label>
                                <input type='text' className='form-control col-sm-10' id='first_name'
                                       placeholder='First Name'
                                       value={this.state.client?.firstName}
                                />
                            </div>
                            <div className='form-group row'>
                                <label htmlFor='middle_name' className='col-sm-2'>Middle Name</label>
                                <input type='text' className='form-control col-sm-10' id='middle_name'
                                       placeholder='Middle Name'
                                       value={this.state.client?.middleName}
                                />
                            </div>
                            <div className='form-group row'>
                                <label htmlFor='last_name' className='col-sm-2'>Last Name</label>
                                <input type='text' className='form-control col-sm-10' id='last_name'
                                       placeholder='Last Name'
                                       value={this.state.client?.lastName}
                                />
                            </div>
                            <div className='form-group row'>
                                <label htmlFor='date_of_birth' className='col-sm-2'>Date of Birth</label>
                                <input type='date' className='form-control col-sm-10' id='month'
                                       value={this.state.client?.dateOfBirth?.jsDate}
                                />
                            </div>
                            <div className='form-group row'>
                                <label htmlFor='gender' className='col-sm-2'>Gender</label>
                                <div className='form-check form-check-inline'>
                                    <input type='radio' id='male' name='gender' className='form-check-input'/>
                                    <label htmlFor='male' className='form-check-label'>Male</label>
                                </div>
                                <div className='form-check form-check-inline'>
                                    <input type='radio' id='female' name='gender' className='form-check-input' />
                                    <label htmlFor='female' className='form-check-label'>Female</label>
                                </div>
                                <div className='form-check form-check-inline'>
                                    <input type='radio' id='other' name='gender' className='form-check-input' />
                                    <label htmlFor='other' className='form-check-label'>Other</label>
                                </div>
                            </div>
                            <div className='form-group row'>
                                <label htmlFor='race' className='col-sm-2'>Race</label>
                                <div className='form-check form-check-inline'>
                                    <input type='radio' id='nonwhite' name='race' className='form-check-input' />
                                    <label htmlFor='nonwhite' className='form-check-label'>Non-White</label>
                                </div>
                                <div className='form-check form-check-inline'>
                                    <input type='radio' id='white' name='race' className='form-check-input' />
                                    <label htmlFor='white' className='form-check-label'>White</label>
                                </div>
                            </div>
                            <div className='form-group row'>
                                <label htmlFor='phone' className='col-sm-2'>Phone</label>
                                <input type='text' className='form-control col-sm-10' id='phone'/>
                            </div>
                            <div className='form-group row'>
                                <label htmlFor='clientPhoto' className='col-sm-2'>Client Photo</label>
                                {this.displayImage("clientPhoto")}
                            </div>
                            <div className='form-group row'>
                                <label htmlFor='clientId' className='col-sm-2'>Photo ID</label>
                                {this.displayImage("photoId")}
                            </div>
                            <div className='form-group row'>
                                <label htmlFor='clientId' className='col-sm-2'>Notes</label>
                                <textarea className='form-control col-sm-10' />
                            </div>
                            <div className="form-group row">
                                <div className='offset-sm-3 col-sm-3'>
                                    <button type='button' className="btn btn-danger"
                                            onClick={this.props.cancelAction}>Cancel Changes
                                    </button>
                                </div>
                                <div className="col-sm-3">
                                    <button
                                        className="btn btn-primary">{this.props.client ? 'Update Client' : 'New Client'}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Fragment>
        )
    }
}

