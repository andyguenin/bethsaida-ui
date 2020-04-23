import React, {ChangeEvent, FormEvent} from 'react';
import {Modal, ModalBody, ModalFooter} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import Client from "../../data/Client";
import BanBuilder from "../../data/BanBuilder";
import {BanType} from "../../data/BanType";
import BDate from "../../data/BDate";
import ErrorMessage from "../app/ErrorMessage";
import RichTextEditor, {EditorValue} from 'react-rte'


interface Props {
    client: Client
    closeModal: () => void
    update: (b: BanBuilder) => void
    show: boolean
    ban: BanBuilder
    delete: () => void
    newBan: boolean
}

interface State {
    banType?: string,
    date: string,
    notes: EditorValue,
    errorMessage?: string
}

export default class BanModal extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = this.constructEmptyState(this.props.ban);
    }

    private constructEmptyState = (builder: BanBuilder): State => {
        return {
            banType: builder.getType(),
            date: BDate.fromDate(builder.getStop() || new Date()).jsDate,
            // notes: htmlToDraft(builder.getNotes() || '')
            notes: RichTextEditor.createValueFromString(builder.getNotes() || '', 'html')
        }
    }


    private handleDateChangeEvent = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState(Object.assign({}, this.state, {
            date: e.target.value
        }))
    };

    private handleDateClickEvent = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState(Object.assign({}, this.state, {
            banType: BanType.DateBan
        }))
    };

    private handleTypeUpdate = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState(Object.assign({}, this.state, {
            banType: e.target.value,
            date: (e.target.value === BanType.DateBan ? this.state.date : '')
        }))
    };

    private setErrorMessage = (errorMessage?: string): void => {
        this.setState(Object.assign({}, this.state, {errorMessage}))
    }

    private handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if ((this.state.date === '' || isNaN(BDate.fromjsDate(this.state.date).toDate().getTime()))&& this.state.banType === BanType.DateBan) {
            this.setErrorMessage('Date must be set');
        } else {
            const newBan = this.props.ban.setNotes(this.state.notes.toString('html'))
                .setStop(BDate.fromjsDate(this.state.date).toDate())
                .setType(this.state.banType);
            this.setErrorMessage(undefined);
            this.props.update(newBan);
        }
    };

    private deleteBan = () => {
        this.setState(Object.assign({}, this.state, this.constructEmptyState(BanBuilder.empty())));
        this.props.delete();
    }

    render() {
        return <Modal show={this.props.show} size='xl'>
            <form onSubmit={this.handleSubmit}>
                <ModalHeader>
                    <h5 className='modal-title'>Ban {this.props.client.fullName}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.closeModal}>
                        <span>&times;</span>
                    </button>
                </ModalHeader>
                <ModalBody>
                    <ErrorMessage errorMessage={this.state.errorMessage}/>


                    <div className='form-group row align-items-start'>
                        <label htmlFor='term' className='col-sm-3 ban-label'><b>Ban term</b></label>
                        <div className={'col-sm-9'}>
                            <div className="align-items-center ban-radio-row">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="ban"
                                    id="timeBan"
                                    value={BanType.DateBan}
                                    onChange={this.handleTypeUpdate}
                                    checked={this.state.banType === BanType.DateBan}
                                />
                                <div className='form-check-label flex-row'>
                                    <label className="d-flex flex-nowrap text-nowrap align-items-center"
                                           htmlFor="timeBan">
                                        <div className={''}>Ban until: &nbsp;</div>
                                        <input
                                            className='form-control'
                                            id='specified'
                                            type='date'
                                            onSelect={this.handleDateClickEvent}
                                            onChange={this.handleDateChangeEvent}
                                            value={this.state.date}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="align-items-center ban-radio-row">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="ban"
                                    id="indefiniteBan"
                                    value={BanType.IndefiniteBan}
                                    onChange={this.handleTypeUpdate}
                                    checked={this.state.banType === BanType.IndefiniteBan}
                                />
                                <label className="form-check-label" htmlFor="indefiniteBan">
                                    Indefinite Ban
                                </label>
                            </div>
                            <div className="align-items-center ban-radio-row">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="ban"
                                    id="permanentBan"
                                    value={BanType.PermanentBan}
                                    onChange={this.handleTypeUpdate}
                                    checked={this.state.banType === BanType.PermanentBan}
                                />
                                <label className="form-check-label" htmlFor="permanentBan">
                                    Permanent Ban
                                </label>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div>
                        <div className='form-group row align-items-start'>
                            <label htmlFor='term' className='col-sm-3 ban-label'><b>Reason for ban</b></label>
                            <div className={'col-sm-9'}>
                                {/*<textarea className={'form-control'} rows={10}/>*/}
                                <RichTextEditor className='text-editor' value={this.state.notes} onChange={(notes) => {
                                    this.setState((os, op) => Object.assign({}, os, {notes}))
                                }}/>
                            </div>
                        </div>
                    </div>


                </ModalBody>
                <ModalFooter>
                    <button type="button" className='btn btn-info pointer' onClick={() => this.props.closeModal()}>Close
                    </button>
                    {
                        (
                            () => {
                                if (this.props.newBan) {
                                    return <button type='button' className='btn btn-danger'
                                                   onClick={this.deleteBan}>Remove Ban</button>
                                }
                            }
                        )()
                    }
                    <button type="submit" className="btn btn-primary">Ban {this.props.client.firstName}</button>
                </ModalFooter>
            </form>
        </Modal>
    }
}