import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { InputText, InputSwitchItem } from 'auth0-extension-ui';
import createForm from '../../utils/createForm';

const apiAccessForm = createForm('apiAccessForm', class ApiAccessForm extends Component {
  static propTypes = {
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    apiAccess: PropTypes.bool
  }

  renderSwitchItem(field) {
    return <Field name={field.name} component={InputSwitchItem} title={field.title} description={field.description} />;
  }

  renderAPIAccessDetails(apiAccess) {
    if (apiAccess) {
      return (
        <div>
          <Field name="token_lifetime" component={InputText} type="number" label="Token Expiration (Seconds)" />
        </div>);
    }
    return null;
  }

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-xs-10">
            <div className="cues-container">
              <div className="use-case-box is-active">
                <div className="explainer-text">
                  <span className="explainer-text-content">
                    API access description
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-2">
            <div className="pull-right">
              <Button bsStyle="primary" disabled={submitting} onClick={handleSubmit}>
                Save
              </Button>
            </div>
          </div>
        </div>

        <div data-columns="1" className="switchboard switchboard-responsive">
          { this.renderSwitchItem({
            title: 'API Access',
            description: (<span>lorem ipsum.</span>),
            name: 'apiAccess'
          }) }
          { this.renderAPIAccessDetails(this.props.apiAccess) }
        </div>
      </div>
    );
  }
});

// Decorate with connect to read form values
const selector = formValueSelector('apiAccessForm');
const connectDecorator = connect(state => {
  const apiAccess = selector(state, 'apiAccess');

  return {
    apiAccess
  };
});

export default connectDecorator(apiAccessForm);
