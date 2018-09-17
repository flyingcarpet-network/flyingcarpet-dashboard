import * as React from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as mapActions from '../../actions/mapActions';
import { BountyFilter } from '../../reducers/dataTypeEnums';

export interface IProps {
  bountyFilter: BountyFilter;
  setBountyFilter: (filter: BountyFilter) => any;
}

interface IState {
  dropdownOpen: boolean;
}

class BountyCreationPanel extends React.Component<IProps, IState> {

  public state = {
    dropdownOpen: false
  }

  public render() {
    const { bountyFilter } = this.props;
    const { dropdownOpen } = this.state;

    return (
      <div>
        <select id="lang" onChange={this.selectChange} value={bountyFilter}>
          <option value={BountyFilter.ALL}>All</option>
          <option value={BountyFilter.INACTIVE}>Inactive (unfunded)</option>
          <option value={BountyFilter.ACTIVE}>Active (funded)</option>
          <option value={BountyFilter.COMPLETE} disabled={true}>Complete (Coming Soon)</option>
        </select>
        <div className="text-center">
            <Dropdown
                isOpen={dropdownOpen}
                toggle={this.toggle}>
                <DropdownToggle color="primary">
                    Bounty status
                </DropdownToggle>
                <DropdownMenu id="lang" onChange={this.selectChange} value={bountyFilter}>
                    <DropdownItem value={BountyFilter.ALL} >Action</DropdownItem>
                    <DropdownItem value={BountyFilter.INACTIVE}>>Inactive (unfunded)</DropdownItem>
                    <DropdownItem value={BountyFilter.ACTIVE}>Active (funded)</DropdownItem>
                    <DropdownItem value={BountyFilter.COMPLETE}>AComplete (Coming Soon)</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
      </div>
    );
  }
  private selectChange = event => {
    const { setBountyFilter } = this.props;

    // Set bounty filter value
    setBountyFilter(event.target.value);
  }

  private toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
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
