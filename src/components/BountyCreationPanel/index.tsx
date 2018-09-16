import Geohash from 'latlon-geohash';
import * as React from 'react';
import { connect } from 'react-redux';
import { withWeb3 } from 'react-web3-provider';
import { compose } from 'redux';
import { change } from 'redux-form';
import Form from './Form';

export interface IProps {
  handleSubmit: () => any;
  mapClickLocation: {lat: number, lng: number};
  formData: any;
  setGeohash: (newGeohash: string) => any;
}

class BountyCreationPanel extends React.Component<IProps> {
  public componentDidUpdate() {
    const { formData, setGeohash } = this.props;

    let geohashInputValue = '';
    // Only access current geohash if it is in fact set (not undefined)
    if (formData.values && formData.values.geohash) {
      geohashInputValue = formData.values.geohash;
    }

    // Get new updated geohash
    const newGeohash = this.getGeohash();

    // Compare new updated geohash to existing one, and if they're different,
    // update the input to contain the new geohash
    if (newGeohash !== geohashInputValue) {
      setGeohash(newGeohash);
    }
  }
  public render() {
    return (
      <div style={{position: "fixed", left: 0, top: 0, bottom: 0, width: 200, paddingTop: 100, backgroundColor: "grey", zIndex: 10}}>
        <Form onSubmit={this.formSubmit} />
      </div>
    );
  }
  private getGeohash = () => {
    const { mapClickLocation } = this.props;

    if (!mapClickLocation.lat || !mapClickLocation.lng) { return ''; }
    return Geohash.encode(mapClickLocation.lat, mapClickLocation.lng);
  }
  private formSubmit = values => {
    console.log(values);
  }
}

export default compose<any>(
  connect(
    state => ({
      mapClickLocation: state.map.mapClickLocation,
      formData: state.form.bountyCreationPanel
    }),
    dispatch => ({
      // Dispatches redux-form action
      setGeohash: (newGeohash: string) => dispatch(change('bountyCreationPanel', 'geohash', newGeohash))
    })
  ),
  withWeb3
)(BountyCreationPanel);
