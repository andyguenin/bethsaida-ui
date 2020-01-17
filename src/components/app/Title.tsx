import React from 'react';


interface IProps {
    name: string
}

export class Title extends React.Component<IProps> {

    public render() {
        return (
            <h1 className='bsd-page-title'>{this.props.name}</h1>
        )
    }
}