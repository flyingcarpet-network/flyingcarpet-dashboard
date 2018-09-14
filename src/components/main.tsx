import mbxClient from '@mapbox/mapbox-sdk';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import * as React from 'react';
import { connect } from 'react-redux';
import { MAPBOX_ACCESS_TOKEN } from '../constants';
import BountyMap from './map';
import Search from './search';

const baseClient = mbxClient({ accessToken: MAPBOX_ACCESS_TOKEN });
const geoCodingService = mbxGeocoding(baseClient);

interface IAppState {
  currentPlace? : [number, number]
}

class Main extends React.Component<{}, IAppState> {
  constructor(props) {
    super(props);

    this.searchPlace = this.searchPlace.bind(this);
    // TO-DO: These are London coordinates, the code should allow an empty
    // 'currentPlace' so that it defaults to the user's inferred location
    this.state = {
      currentPlace: [-0.1275, 51.50722]
    }
  }

  public render() {
    return (
      <div>
        <BountyMap
          center={this.state.currentPlace}
        />
        <Search
          onSearch={this.searchPlace}
        />
      </div>
    );
  }

  public changeCurrentPlace(geoCodingResults) {
    const {features} = geoCodingResults && geoCodingResults.body;
    if (!features || !features.length) {
      // TO-DO: We might want to handle this error
      return;
    }

    const relevantResult = features[0];
    const coords = relevantResult && relevantResult.center;
    if (!coords) {
      // TO-DO: We might want to handle this error
      return;
    }
    this.setState({ currentPlace: coords });
  }

  public searchPlace(searchedPlace) {
    geoCodingService
      .forwardGeocode({query: searchedPlace})
      .send()
      .then((geoCodingResults) => { this.changeCurrentPlace(geoCodingResults)});
  }

}

export default connect(() => ({
}), dispatch => ({
}))(Main);
