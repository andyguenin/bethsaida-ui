import React, {Fragment} from 'react';
import buildinfo from '../../buildid.json'

export default class DevInfo extends React.Component<{}> {

    public nonDev() {
        return <Fragment />
    }

    public dev() {
        return <div className='devinfo'>
            EDGE ENVIRONMENT - FOR TESTING PURPOSES ONLY<br />
            Build id: {buildinfo['id']}<br />
            Build time: {buildinfo['time']}
        </div>;
    }
    render() {
        return (
            <div>
                {window.location.hostname === 'bethsaida.downtowndailybread.org' ? this.nonDev() : this.dev()}
                {this.props.children}
            </div>
        )
    }
}