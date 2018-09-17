import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Field, reduxForm } from 'redux-form';


export interface IProps {
  handleSubmit: () => any;
  formData: any;
  error: any;
}

class Form extends React.Component<IProps> {
  public render() {
    const { handleSubmit, formData, error } = this.props;

    return (
      <div>
        {/* <ContainerHeader
            title="Create Bounty"/> */}
        <div className="row mb-md-4">
            <div className="card">
             <div className="card-header">Register new bounty</div>
             <div className="card-body">
               <h3 className="card-title">Description</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Geo hash</label>
                    <Field
                      name="geohash"
                      class="form-control"
                      component="input"
                      type="string"
                      placeholder="Click The Map"
                      style={error ? { border: '2px solid red' } : {}}
                    />
                  </div>
                  <div className="form-group">
                    <label>Data Collection Radius</label>
                    <Field
                      name="dataCollectionRadius"
                      component="input"
                      type="number"
                      class="form-control"
                      parse={this.parseNumber}
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <Field
                        name="useType"
                        component="select"
                        class="form-control">
                      <option value="rooftop">Rooftop</option>
                      <option value="land">Land</option>
                      <option value="forest">Forest</option>
                    </Field>
                  </div>
                  <div className="form-group">
                    <label>Collection</label>
                    <Field
                        name="collectionType"
                        class="form-control"
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
                          class="form-control"
                          component="select">
                          <option value="thermal">Thermal</option>
                          <option value="gpr">Ground Penetrating Radar</option>
                        </Field>
                      </div>
                    </div>
                  }
                  <div className="form-group">
                    <label>Resolution</label>
                    <Field
                      name="resolution"
                      class="form-control"
                      component="input"
                      type="string"
                    />
                  </div>
                  <div className="form-group">
                    <label>Format</label>
                    <Field name="fileFormat"
                      component="select"
                      class="form-control">
                      <option value="raw">RAW</option>
                      <option value="jpeg">JPEG</option>
                      <option value="h.264">H.264</option>
                      <option value="mpeg">MPEG</option>
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
      </div>
    )
  }
  private parseNumber(value: any) {
    return Number(value);
  }
}

export default compose<any>(
  connect(
    state => ({
      formData: state.form.bountyCreationPanel
    }),
    null
  ),
  reduxForm({
    form: 'bountyCreationPanel'
  })
)(Form);
