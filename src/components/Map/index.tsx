import * as React from 'react';
import ReactMapboxGl from 'react-mapbox-gl';
import { MapEvent } from 'react-mapbox-gl/lib/map-events';

// TODO to be injected by dev or prod on script
const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoianVsaWVuYm91dGVsb3VwIiwiYSI6ImNqbGdka2VzazBhODQzcG8wczU0ZnZsMWMifQ.3b2k0gS37rmqa2t5N3yBiA'
});

const mapStyle = 'mapbox://styles/mapbox/dark-v9';

const styles = {
  map: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  } as React.CSSProperties
};


export interface IProps {
  center?: number[];
  mapInit?: MapEvent;
  zoom?: [number];
}

class BountyMap extends React.Component<IProps> {
  public render() {
    const { center, mapInit, zoom } = this.props;

    return (
      <div className="app-wrapper">
        <div className="d-flex justify-content-center">
          <Map
            center={center}
            containerStyle={styles.map}
            onStyleLoad={mapInit}
            style={mapStyle}
            zoom={zoom}/>
        </div>
      </div>
    )
  }
}

export default BountyMap;
