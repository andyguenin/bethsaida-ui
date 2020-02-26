import React from 'react';
import buildinfo from '../../buildid.json'

export default class DevInfo extends React.Component<{}> {

    render() {
        return (
            <div>
                <div className='devinfo'>
                    EDGE ENVIRONMENT - FOR TESTING PURPOSES ONLY<br />
                    Build id: {buildinfo['id']}<br />
                    Build time: {buildinfo['time']}
                </div>
                {this.props.children}
            </div>
        )
    }
}