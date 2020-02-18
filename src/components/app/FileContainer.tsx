import React, {Fragment} from 'react';
import TopNav from "./TopNav";

export default class FileContainer extends React.Component<{}> {
    render() {
        return (
          <Fragment>
              <TopNav/>
              <div className='container-fluid' id='main-container'>
                  {this.props.children}
              </div>
          </Fragment>
        );
    }
}