import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as mapActions from '../../actions/mapActions';
import { BountyFilter } from '../../reducers/dataTypeEnums';

export interface IProps {
  bountyFilter: BountyFilter;
  setBountyFilter: (filter: BountyFilter) => any;
}

class BountyCreationPanel extends React.Component<IProps> {
  public render() {
    const { bountyFilter } = this.props;

    return (
      <select id="lang" onChange={this.selectChange} value={bountyFilter}>
        <option value={BountyFilter.ALL}>All</option>
        <option value={BountyFilter.INACTIVE}>Inactive (unfunded)</option>
        <option value={BountyFilter.ACTIVE}>Active (funded)</option>
        <option value={BountyFilter.COMPLETE} disabled={true}>Complete (Coming Soon)</option>
      </select>
    );
  }
  private selectChange = event => {
    const { setBountyFilter } = this.props;

    // Set bounty filter value
    setBountyFilter(event.target.value);
  }
}

export default connect(
  state => ({
    bountyFilter: state.map.bountyFilter
  }),
  dispatch => ({
    setBountyFilter: bindActionCreators(mapActions.setBountyFilter, dispatch)
  })
)(BountyCreationPanel);
