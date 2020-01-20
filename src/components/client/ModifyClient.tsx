import React, {ChangeEvent, Fragment} from 'react';
import Client from "../../data/Client";


interface IProps {
    client?: Client
    cancelAction: () => void
}

interface IState {
    deleteImage?: boolean
    file?: string
}

export class ModifyClient extends React.Component<IProps> {
    state: IState = {
        file: undefined,
        deleteImage: undefined
    }

    constructor(props: IProps) {
        super(props);

        this.handleUpdate = this.handleUpdate.bind(this)
    }

    static defaultProps = {
        newClient: true,
        client: undefined
    };

    private handleUpdate(e: ChangeEvent<HTMLInputElement>): void {
        console.log('abcdefg')
        if (e.target && e.target.files) {
            this.setState(Object.assign({}, this.state, {
                file: URL.createObjectURL(e.target.files[0])
            }))
        }
    }

    private displayImage() {
        const upload = <input type='file' className='form-control col-sm-4' id='photo-upload'
                              onChange={this.handleUpdate}/>


        const displayImage = (file: string, name: string) => {
            return (
                <div className='col-sm-6'>
                    <img id='photo-preview' src={file}
                         alt={'photo of ' + name}/>
                    <button type='button' className='btn btn-info reupload' onClick={() => this.setState({
                        ...this.state,
                        deleteImage: true,
                        file: undefined
                    })}>Delete Image</button>
                </div>);
        };

        if (this.state.file) {
            return displayImage(this.state.file, this.props.client?.fullName || '');
        } else {
            if(this.props.client?.image && !this.state.deleteImage) {
                return displayImage(this.props.client.image, this.props.client.fullName || '');
            } else {
                return upload;
            }
        }
    }

    render() {
        return (
            <Fragment>
                <div className='row'>
                    <div className='offset-1 col-10'>
                        <form>
                            <div className='form-group row'>
                                <label htmlFor='first_name' className='col-sm-2'>First Name</label>
                                <input type='text' className='form-control col-sm-10' id='first_name'
                                       placeholder='First Name'
                                       defaultValue={this.props.client?.firstName}
                                />
                            </div>
                            <div className='form-group row'>
                                <label htmlFor='middle_name' className='col-sm-2'>Middle Name</label>
                                <input type='text' className='form-control col-sm-10' id='middle_name'
                                       placeholder='Middle Name'
                                       defaultValue={this.props.client?.middleName}
                                />
                            </div>
                            <div className='form-group row'>
                                <label htmlFor='last_name' className='col-sm-2'>Last Name</label>
                                <input type='text' className='form-control col-sm-10' id='last_name'
                                       placeholder='Last Name'
                                       defaultValue={this.props.client?.lastName}
                                />
                            </div>
                            <div className='form-group row'>
                                <label htmlFor='date_of_birth' className='col-sm-2'>Date of Birth</label>
                                <input type='date' className='form-control col-sm-10' id='month'
                                       defaultValue={this.props.client?.dateOfBirth.jsDate}
                                />
                            </div>
                            <div className='form-group row'>
                                <label htmlFor='photo' className='col-sm-2'>Client Photo</label>
                                <div className='col-sm-2'>
                                    <div className="btn-group">
                                        <button type="button" className="btn btn-danger dropdown-toggle"
                                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Action
                                        </button>
                                        <div className="dropdown-menu">
                                            <a className="dropdown-item" href="#">Action</a>
                                            <a className="dropdown-item" href="#">Another action</a>
                                            <a className="dropdown-item" href="#">Something else here</a>
                                            <div className="dropdown-divider"></div>
                                            <a className="dropdown-item" href="#">Separated link</a>
                                        </div>
                                    </div>
                                </div>
                                {this.displayImage()}
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

