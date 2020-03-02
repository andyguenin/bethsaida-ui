import React, {Fragment} from 'react';
import './Loader.css'
import {isElement} from "react-dom/test-utils";

interface IProps {
    loading: boolean,
    emptyText: string,
    isEmpty: boolean
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
                if(this.props.isEmpty) {
                    return <div>{this.props.emptyText}</div>
                } else {
                    return this.props.children
                }
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


