import Geohash from 'latlon-geohash';
import * as React from 'react';
import { connect } from 'react-redux';
import { withWeb3 } from 'react-web3-provider';
import { bindActionCreators, compose } from 'redux';
import { change, Field, reduxForm } from 'redux-form';
import * as tcroActions from '../../actions/tcroActions';

export interface IProps {
  handleSubmit: () => any;
  mapClickLocation: {lat: number, lng: number};
  formData: any;
  setGeohash: (newGeohash: string) => any;
}

class BountyMap extends React.Component<IProps> {
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
    const { handleSubmit } = this.props;

    return (
      <div style={{position: "fixed", left: 0, top: 0, bottom: 0, width: 200, paddingTop: 100, backgroundColor: "grey", zIndex: 10}}>
        <form onSubmit={handleSubmit}>
          <Field
            name="geohash"
            component="input"
            type="string"
            value={this.getGeohash}
            placeholder="Click The Map"
          />
          <br /><br />
          <Field
            name="dataCollectionRadius"
            component="input"
            type="number"
            placeholder="Data Collection Radius"
            parse={this.parseNumber}
          />
          <br /><br />
          <Field name="useType" component="select">
            <option>- Use Type -</option>
            <option value="rooftop">Rooftop</option>
            <option value="land">Land</option>
            <option value="forest">Forest</option>
          </Field>
          <br /><br />
          <Field name="collectionType" component="select">
            <option>- Collection Type -</option>
            <option value="rooftop">Drone</option>
            <option value="satellite">Satellite</option>
          </Field>
        </form>
      </div>
    )
  }
  private parseNumber(value: any) {
    return Number(value);
  }
  private getGeohash = () => {
    const { mapClickLocation } = this.props;

    if (!mapClickLocation.lat || !mapClickLocation.lng) { return ''; }
    return Geohash.encode(mapClickLocation.lat, mapClickLocation.lng);
  }
}

export default compose<any>(
  connect(
    state => ({
      bounties: state.tcro.bounties,
      center: state.map.center,
      mapClickLocation: state.map.mapClickLocation,
      formData: state.form.bountyCreationPanel
    }),
    dispatch => ({
      setBounties: bindActionCreators(tcroActions.setBounties, dispatch),
      // Dispatches redux-form action
      setGeohash: (newGeohash: string) => dispatch(change('bountyCreationPanel', 'geohash', newGeohash))
    })
  ),
  reduxForm({
    form: 'bountyCreationPanel'
  }),
  withWeb3
)(BountyMap);
