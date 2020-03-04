import React from 'react';

interface Props {

}

export default class Notes extends React.Component<Props> {
    render() {
        return (
            <div className='col-md-5'>
                <h3 className='text-right'>Notes</h3>
                <i>No notes</i>
            </div>
            )
    }
}