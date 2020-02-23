import React from 'react';
import buildinfo from '../../buildid.json'

export default class DevInfo extends React.Component<{}> {

    render() {
        return (
            <div className='devinfo'>
                EDGE ENVIRONMENT<br />
                Build id: {buildinfo['id']}<br />
                Build time: {buildinfo['time']}
            </div>
        )
    }
}