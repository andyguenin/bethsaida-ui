import React from 'react';
import FileContainer from "./FileContainer";


interface IProps {
    name: string
}

export class Title extends React.Component<IProps> {

    public render() {
        return (
            <div className='row button-row'>
                <div className='col-6'><h1>{this.props.name}</h1></div>
                <div className='col-6'>
                    <form className='form-inline' id='buttonid'>
                        {this.props.children}
                    </form>
                </div>
            </div>
        )
    }
}