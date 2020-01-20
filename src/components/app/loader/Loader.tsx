import React, {Fragment} from 'react';
import './Loader.css'

interface IProps {
    loading: boolean
}

export class Loader extends React.Component<IProps> {
    public render() {
        if (this.props.loading) {
            return (
                <div className='row'>
                    <div className='col-md-12'>
                        <div className="center">
                            <InlineLoader/>
                        </div>
                    </div>
                </div>
            )
        } else {
            if (this.props.children) {
                return this.props.children
            } else {
                return <Fragment/>
            }
        }
    }
}

export class InlineLoader extends React.Component<{}> {
    render() {
        return (
            <div className="bsd-loader">
                <div></div>
                <div></div>
                <div></div>
            </div>
        );
    }
}


