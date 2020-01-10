import React, {Fragment} from "react";
import SideNav from "./SideNav";

interface IBottomWrapperProps {
    contentTitle?: string
}

export class BottomWrapper extends React.Component<IBottomWrapperProps> {
    public static defaultProps = {
        contentTitle: ""
    };

    public render() {
        return (
            <Fragment>
                <div className="container-fluid">
                    <div className="spacer row">
                        <div className="col-md-12">dd</div>
                    </div>
                    <div className="row">
                        <SideNav/>
                        <div className="col-md-10 content main-content">
                            {this.contentTitle()}
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }


    private contentTitle() {
        if (this.props.contentTitle === '') {
            return <Fragment />
        } else {
            return <h1>{this.props.contentTitle}</h1>
        }

    }
}