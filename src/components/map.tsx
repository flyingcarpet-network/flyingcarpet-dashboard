import * as React from 'react';
import ReactMapboxGl from 'react-mapbox-gl';

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

class BountyMap extends React.Component {
  public render() {
    return (
      <Map
        containerStyle={styles.map}
        style={mapStyle}>
      <div>Test</div>
      </Map>
    )
  }
}

export default BountyMap;
