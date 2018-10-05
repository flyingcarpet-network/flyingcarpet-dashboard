import * as React from 'react';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import * as mapActions from '../../actions/mapActions';

export interface IProps {
  handleSubmit: () => any;
  formData: any;
  error: any;
  isBountyCreationPanelOpen: boolean;
  setIsBountyCreationPanelOpen: (isOpen: boolean) => any;
}

class Form extends React.Component<IProps> {
  public componentDidMount = () => {
    if (isMobile) {
      const { setIsBountyCreationPanelOpen } = this.props;

      // If the dashboard is being opened on a mobile device, then initially hide the bounty creation panel
      setIsBountyCreationPanelOpen(false);
    }
  }
  public render() {
    const { handleSubmit, formData, error, isBountyCreationPanelOpen } = this.props;

    return (
      <div>
        <div className="card">
         <div className="card-header" onClick={this.toggleBountyCreationPanel} style={{cursor: "pointer"}}>Register New Opportunity</div>
         <div className={"card-body" + ((!isBountyCreationPanelOpen) ? " d-none" : "")}>
           <h3 className="card-title">Description</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Geo hashes</label>
                <Field
                  name="geohashes"
                  className="form-control"
                  component="input"
                  type="string"
                  placeholder="Click The Map"
                  style={error ? { border: '2px solid red' } : {}}
                  disabled={true}
                />
              </div>
              <div className="form-group">
                <label>Coordinates</label>
                <Field
                  name="coordinates"
                  className="form-control"
                  component="input"
                  type="string"
                  placeholder="Click The Map"
                  style={error ? { border: '2px solid red' } : {}}
                  disabled={true}
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <Field
                    name="useType"
                    component="select"
                    className="form-control">
                  <option value="rooftop">Rooftop</option>
                  <option value="land">Land</option>
                  <option value="forest">Forest</option>
                </Field>
              </div>
              <div className="form-group">
                <label>Collection</label>
                <Field
                    name="collectionType"
                    className="form-control"
                    component="select">
                    <option value="drone">Drone</option>
                    <option value="satellite">Satellite</option>
                </Field>
              </div>
              {(formData && formData.values && formData.values.collectionType === 'drone') &&
                <div>
                  <div className="form-group">
                    <label>Hardware</label>
                    <Field
                      name="droneType"
                      className="form-control"
                      component="select">
                      <option value="thermal">Thermal</option>
                      <option value="gpr">Ground Penetrating Radar</option>
                    </Field>
                  </div>
                </div>
              }
              <div className="form-group">
                <label>Format</label>
                <Field name="fileFormat"
                  component="select"
                  className="form-control">
                  <option value="mpeg">MPEG</option>
                  <option value="raw">RAW</option>
                  <option value="jpeg">JPEG</option>
                  <option value="h.264">H.264</option>
                </Field>
              </div>
              {error && <strong>{error}</strong>}
              <button
                type="submit"
                className="jr-btn jr-btn-secondary text-uppercase btn-block btn btn-default">
                Submit
              </button>
            </form>
         </div>
        </div>
      </div>
    )
  }
  private toggleBountyCreationPanel = () => {
    const { isBountyCreationPanelOpen, setIsBountyCreationPanelOpen } = this.props;

    setIsBountyCreationPanelOpen(!isBountyCreationPanelOpen);
  }
}

export default compose<any>(
  connect(
    state => ({
      formData: state.form.bountyCreationPanel,
      isBountyCreationPanelOpen: state.map.isBountyCreationPanelOpen
    }),
    dispatch => ({
      setIsBountyCreationPanelOpen: bindActionCreators(mapActions.setIsBountyCreationPanelOpen, dispatch)
    })
  ),
  reduxForm({
    form: 'bountyCreationPanel'
  })
)(Form);
