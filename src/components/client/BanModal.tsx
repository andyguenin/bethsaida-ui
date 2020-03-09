import React from 'react';
import {Modal, ModalBody, ModalFooter} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import Client from "../../data/Client";

interface Props {
    client: Client
    closeModal: () => void
    show: boolean
}

export default class BanModal extends React.Component<Props> {

    render() {
        return <Modal show={this.props.show} size='lg'>
            <ModalHeader>
                <h5 className='modal-title'>Ban {this.props.client.fullName}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span onClick={this.props.closeModal}>&times;</span>
                </button>
            </ModalHeader>
            <ModalBody>

            </ModalBody>
            <ModalFooter>
                <button type="button" className='btn btn-info pointer' onClick={() => this.props.closeModal()}>Close
                </button>
                <button type="button" className="btn btn-primary">Ban {this.props.client.firstName}</button>
            </ModalFooter>
        </Modal>
    }
}