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
      <div className="row">
        <div className="col-sm-9 col-md-9 col-lg-10"/>
        <div className="col-sm-2 col-md-2 col-lg-1 ml-3 mr-3 ml-sm-0 mr-sm-0" style={{zIndex: 90, marginTop: 14,marginBottom: -17}}>
          <select id="lang" className="form-control jr-btn jr-btn-xs jr-btn-primary btn btn-default" onChange={this.selectChange} value={bountyFilter} style={{fontSize: 10}}>
            <option value={BountyFilter.ALL}>Bounties</option>
            <option value={BountyFilter.INACTIVE}>Inactive (unfunded)</option>
            <option value={BountyFilter.ACTIVE}>Active (funded)</option>
            <option value={BountyFilter.COMPLETE} disabled={true}>Complete (Coming Soon)</option>
          </select>
        </div>
        <div className="col-sm-1 col-md-1 col-lg-1"/>
      </div>
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
