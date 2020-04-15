import React from 'react';
import FileContainer from "./FileContainer";


interface IProps {
    name?: string
}

export class Title extends React.Component<IProps> {

    public render() {
        return (
            <div className='row button-row'>
                <div className='col-sm-12 col-lg-6'>
                    <h1>{this.props.name}</h1>
                </div>
                <div className='col-sm-12 col-lg-6'>
                    <form className='form-inline' id='buttonid' onSubmit={e => {
                        e.preventDefault()
                        console.log(e.currentTarget)
                    }}>
                        {this.props.children}
                    </form>
                </div>
            </div>
        )
    }
}