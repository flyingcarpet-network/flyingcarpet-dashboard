import * as React from 'react';
import { connect } from 'react-redux';
import BountyMap from './map';
import Search from './search';

class Main extends React.Component {

  public render() {
    return (
      <div>
        <BountyMap/>
        <Search/>
      </div>
    );
  }
}

export default connect(() => ({
}), dispatch => ({
}))(Main);
