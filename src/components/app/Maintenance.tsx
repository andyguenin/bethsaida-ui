import React, {Fragment} from 'react'
import ddb from '../../assets/ddb.svg';


export default class Maintenance extends React.Component<{}> {

    render() {
        return (
            <Fragment>
                <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <img className='image-row' src={ddb}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-12'>
                        <h1>Bethsaida is down for its daily maintenance window.</h1>
                    </div>
                </div>
                </div>
            </Fragment>
        )
    }
}