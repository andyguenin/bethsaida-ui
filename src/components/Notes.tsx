import React, {FormEvent, FormEventHandler, Fragment} from 'react';

import RichTextEditor, {EditorValue} from 'react-rte'
import {Button} from "react-bootstrap";


interface Props {
    notes?: string,
    onUpdate: (note: string, followup: (note: string) => void) => void
}

interface State {
    initialNote: EditorValue
    inEditMode: boolean
    notes: EditorValue,
}

export default class Notes extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            initialNote: this.createEditorFromString(this.props.notes),
            inEditMode: false,
            notes: this.createEditorFromString(this.props.notes)
        }
    }

    private createEditorFromString(s?: string): EditorValue {
        return RichTextEditor.createValueFromString(s || '', 'html')
    }

    private setEditMode = (editable: boolean): void => {
        this.setState((s, p) => Object.assign({}, s, {inEditMode: editable}))
    }

    private toolbarConfig = (): any => {
        return {
            // Optionally specify the groups to display (displayed in the order listed).
            display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
            INLINE_STYLE_BUTTONS: [
                {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
                {label: 'Italic', style: 'ITALIC'},
                {label: 'Underline', style: 'UNDERLINE'}
            ],
            BLOCK_TYPE_DROPDOWN: [
                {label: 'Normal', style: 'unstyled'},
                {label: 'Heading Large', style: 'header-one'},
                {label: 'Heading Medium', style: 'header-two'},
                {label: 'Heading Small', style: 'header-three'}
            ],
            BLOCK_TYPE_BUTTONS: [
                {label: 'UL', style: 'unordered-list-item'},
                {label: 'OL', style: 'ordered-list-item'}
            ]
        }
    };

    private submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.props.onUpdate(this.state.notes.toString('html'), (note) => {
                this.setState((s, p) => Object.assign({}, s, {
                    initialNote: s.notes,
                    inEditMode: false
                }))
            }
        );
    }

    render() {
        return (
            // <div className='col-md-12 col-lg-4 note-col'>
            <div>
                <div className='row'>
                    <div className='col-md-12 col-lg-6'>
                        <h3 className=''>Notes</h3>
                    </div>
                    {
                        (
                            () => {
                                if (this.state.inEditMode) {
                                    return <div className={'col-md-12 col-lg-6'}/>
                                } else {
                                    return <div className='col-md-12 col-lg-6 text-right edit-note'>
                                        <button type={'button'} className={'btn btn-info full-btn'}
                                                onClick={() => this.setEditMode(true)}>Edit Note
                                        </button>
                                    </div>
                                }
                            }
                        )()
                    }
                </div>

                {
                    (
                        () => {
                            if (this.state.inEditMode) {
                                return <form onSubmit={this.submit}>
                                    <RichTextEditor
                                        className='text-editor'
                                        toolbarConfig={this.toolbarConfig()}
                                        value={this.state.notes}
                                        onChange={(notes) => {
                                            this.setState((os, op) => Object.assign({}, os, {notes}))
                                        }}/>
                                    <div className='button-row text-right'>
                                        <Button type='button' className='btn' onClick={() => {
                                            this.setState((s, p) => Object.assign({}, s, {
                                                notes: s.initialNote,
                                                inEditMode: false
                                            }))
                                        }}>Cancel Changes</Button>
                                        <Button type='submit' className='btn'>Save Note</Button>
                                    </div>

                                </form>
                            } else {
                                let innerHtml = this.state.notes.toString('html');
                                if (innerHtml === undefined) {
                                    innerHtml = ''
                                }
                                if (innerHtml === '<p><br></p>') {
                                    innerHtml = ''
                                }
                                if (innerHtml === '') {
                                    innerHtml = '<i></i>'
                                }
                                return <div
                                    dangerouslySetInnerHTML={{__html: innerHtml}}
                                    onClick={() => this.setEditMode(true)}
                                />
                            }
                        }
                    )()
                }
            </div>
        )
    }
}