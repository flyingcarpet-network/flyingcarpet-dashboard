import mbxClient from '@mapbox/mapbox-sdk';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import *  as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as mapActions from '../../actions/mapActions';
import { MAPBOX_ACCESS_TOKEN } from '../../constants';

const KEYCODES = {
  ENTER: 13
};

const baseClient = mbxClient({ accessToken: MAPBOX_ACCESS_TOKEN });
const geoCodingService = mbxGeocoding(baseClient);

export interface IProps {
  web3: any;
  searchTerm: string;
  setCenter: (center: [number, number]) => any;
  setSearchTerm: (term: string) => any;
}

class SearchBox extends React.Component<IProps> {
  public render() {
    return (
      <div className="search-bar right-side-icon bg-transparent d-none d-lg-block">
          <div className="form-group">
              <input
                className="form-control border-0"
                type="search"
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
              />
              <button className="search-icon"><i className="zmdi zmdi-search zmdi-hc-lg"/></button>
          </div>
      </div>
    );
  }

  private onChange = (event) => {
    const { setSearchTerm } = this.props;

    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
  }

  private onKeyDown = (event) => {
    const { searchTerm } = this.props;

    const keyCode = event.which;

    if (keyCode === KEYCODES.ENTER) {
      this.searchPlace(searchTerm || '');
    }
  }

  private searchPlace(searchedPlace) {
    geoCodingService
      .forwardGeocode({query: searchedPlace})
      .send()
      .then((geoCodingResults) => { this.changeCurrentPlace(geoCodingResults)});
  }

  private changeCurrentPlace = (geoCodingResults) => {
    const { setCenter } = this.props;
    const { features } = geoCodingResults && geoCodingResults.body;

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
    setCenter(coords);
  }
};

export default connect(
  state => ({
    searchTerm: state.map.searchTerm
  }),
  dispatch => ({
    setCenter: bindActionCreators(mapActions.setCenter, dispatch),
    setSearchTerm: bindActionCreators(mapActions.setSearchTerm, dispatch)
  })
)(SearchBox);
