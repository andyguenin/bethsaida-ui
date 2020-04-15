import React from 'react';
import {Modal, ModalBody} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";

interface Props {
    title?: string
    show: boolean
    close: () => void
}

export default class ElemModal extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

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
        </Modal>;
    }

}