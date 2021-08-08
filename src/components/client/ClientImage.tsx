import Client from "../../data/Client";
import React from "react";
import Env from "../../environment/Env";
import unknown from "../../assets/unknown-image.png";

interface Props {
    client?: Client
    tpe: "photograph" | "client photo id"
}

export default class ClientImage extends React.Component<Props, {}> {

    constructor(props: Props) {
        super(props);
    }

// {this.displayImage('photo id scan', this.props.client.fullName, this.props.client.photoId)}

    private displayImage() {
        const imageTag = this.props.tpe === 'photograph' ? this.props.client?.clientPhoto : this.props.client?.photoId
        const imageType = this.props.tpe
        const name = this.props.client?.fullName

        if (imageTag !== undefined && imageTag !== '') {
            return (<img width='100%'
                         src={Env.get().imageUrl + '/' + imageTag + '_400.png'}
                         alt={imageType.charAt(0).toUpperCase() + imageType.slice(1) + ' of ' + name}/>)
        } else {
            if(imageType === 'photograph') {
                return (<img width='100%' src={unknown} />)
            } else {
                return <b>No photo id found for {name}</b>
            }


        }
    }

    public render() {
        return this.displayImage()
    }
}