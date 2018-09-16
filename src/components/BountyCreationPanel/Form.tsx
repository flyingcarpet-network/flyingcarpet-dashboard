import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import CardBox from './../CardBox';
import ContainerHeader from './../ContainerHeader';

export interface IProps {
  handleSubmit: () => any;
  formData: any;
}

class Form extends React.Component<IProps> {
  public render() {
    const { handleSubmit, formData } = this.props;

    return (
      <div>
        <ContainerHeader
            title="Create Bounty"/>

        <div className="row mb-md-4">
            <CardBox styleName="col-lg-12" heading="Title cardbox">
              <form onSubmit={handleSubmit}>
                <Field
                  name="geohash"
                  component="input"
                  type="string"
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
                  <option value="drone">Drone</option>
                  <option value="satellite">Satellite</option>
                </Field>
                <br /><br />
                {(formData && formData.values && formData.values.collectionType === 'drone') &&
                  <div>
                    <Field name="droneType" component="select">
                      <option>- Embedded Drone Hardware -</option>
                      <option value="thermal">Thermal</option>
                      <option value="gpr">Ground Penetrating Radar</option>
                    </Field>
                    <br /><br />
                  </div>
                }
                <Field
                  name="resolution"
                  component="input"
                  type="string"
                  placeholder="Data Collection Resolution"
                />
                <br /><br />
                <Field name="fileFormat" component="select">
                  <option>- File Format -</option>
                  <option value="raw">RAW</option>
                  <option value="jpeg">JPEG</option>
                  <option value="h.264">H.264</option>
                  <option value="mpeg">MPEG</option>
                </Field>
                <br /><br />
                <button type="submit">Submit</button>
              </form>
            </CardBox>
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
