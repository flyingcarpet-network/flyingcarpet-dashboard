import { css, StyleSheet } from 'aphrodite';
import * as React from 'react';

const styles = StyleSheet.create({
  icon: {
    bottom: 0,
    left: 16,
    margin: 'auto',
    position: 'absolute',
    top: 0
  },
  input: {
    float: 'right',
    width: '20%'
  },
  wrapper: {
    flex: 1,
    margin: '10px 10px 0 0',
    position: 'relative'
  }
});

const Search: React.StatelessComponent = () => (
  <div className={css(styles.wrapper)}>
    <input
      className={css(styles.input)}
      placeholder="Search heatmap"
    />
  </div>
)

export default Search;
