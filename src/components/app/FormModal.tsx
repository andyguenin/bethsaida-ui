import React, {FormEvent} from 'react';
import {Modal, ModalBody, ModalFooter} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";

interface Props {
    title?: string
    show: boolean
    close: () => void
    submitButton?: boolean
    onSubmit: (fe: FormEvent<HTMLFormElement>) => void
}

export default class FormModal extends React.Component<Props> {
    render() {
        return <Modal show={this.props.show} size='xl'>
            <form onSubmit={this.props.onSubmit}>
                <ModalHeader>
                    <h5>{this.props.title}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.close}>
                        <span>&times;</span>
                    </button>
                </ModalHeader>
                <ModalBody>
                    {this.props.children}
                </ModalBody>
                {
                    (
                        () => {
                            if (this.props.submitButton !== undefined && this.props.submitButton) {
                                return (
                                    <ModalFooter>
                                        <button type='button' className='btn btn-lg btn-danger'
                                                onClick={() => this.props.close()}>
                                            Close
                                        </button>
                                        <button type='submit' className='btn btn-lg btn-success'>
                                            Submit
                                        </button>
                                    </ModalFooter>
                                )
                            }
                        }
                    )()
                }
            </form>
        </Modal>;
    }
}
