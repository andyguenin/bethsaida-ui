import React, {Fragment} from 'react';
import './Loader.css'
import {render} from "react-dom";

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
                            <div className="bsd-loader">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
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



