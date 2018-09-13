import mbxClient from '@mapbox/mapbox-sdk';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import * as React from 'react';
import { connect } from 'react-redux';
import { MAPBOX_ACCESS_TOKEN } from '../constants';
import BountyMap from './map';
import Search from './search';

const baseClient = mbxClient({ accessToken: MAPBOX_ACCESS_TOKEN });
const geoCodingService = mbxGeocoding(baseClient);

class Main extends React.Component{
  public render() {
    return (
      <div>
        <BountyMap/>
        <Search
          onSearch={this.searchPlace}
        />
      </div>
    );
  }

  private searchPlace(searchedPlace) {
    geoCodingService.forwardGeocode({query: searchedPlace});
  }

}

export default connect(() => ({
}), dispatch => ({
}))(Main);
