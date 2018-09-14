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

const KEYCODES = {
  ENTER: 13
};

interface IAppProps {
  onSearch(searchTerm: string): void
}

interface IAppState {
  searchTerm? : string
}

class Search extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.state = {
      searchTerm: ''
    };
  }

  public render() {
    return (
      <div className={css(styles.wrapper)}>
        <input
          className={css(styles.input)}
          placeholder="Search heatmap"
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          value={this.state.searchTerm}
        />
      </div>
    )
  }

  private onChange(event) {
    const searchTerm = event.target.value;
    this.setState({ searchTerm });

  }

  private onKeyDown(event){
    const keyCode = event.which;

    if (keyCode === KEYCODES.ENTER) {
      this.props.onSearch(this.state.searchTerm || '');
    }
  }
}

export default Search;
