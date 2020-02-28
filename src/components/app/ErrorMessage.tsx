import React, {Fragment} from 'react';


interface Props {
    errorMessage?: string
}

export default class ErrorMessage extends React.Component<Props> {

    render() {
        if(this.props.errorMessage === undefined) {
            return <Fragment />
        } else {
            return (<div className='row'>
                <div className='col-12 alert alert-danger'>
                    {this.props.errorMessage}
                </div>
            </div>)
        }
    }
}