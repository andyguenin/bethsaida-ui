import React from 'react';
import {Modal, ModalBody, ModalFooter} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";

interface Props {
    title?: string
    show: boolean
    close: () => void
    submitButton?: boolean
}

export default class ElemModal extends React.Component<Props> {

    render() {
        return <Modal show={this.props.show} size='xl'>
            <ModalHeader>
                <h5>{this.props.title}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span onClick={this.props.close}>&times;</span>
                </button>
            </ModalHeader>
            <ModalBody>
                {this.props.children}
            </ModalBody>
            {
                (
                    () => {
                        if(this.props.submitButton !== undefined && this.props.submitButton) {
                            return (
                                <ModalFooter>
                                    <button type='button' className='btn btn-danger' onClick={() => this.props.close()}>
                                        Close
                                    </button>
                                    <button type='submit' className='btn btn-success'>
                                        Submit
                                    </button>
                                </ModalFooter>
                            )
                        }
                    }
                )()
            }
        </Modal>;
    }

}