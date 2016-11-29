import path from 'path';
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
        <div style={{ marginTop: '25px' }}>
          <h4>API Settings</h4>
          <div className="row">
            <div className="col-xs-6">
              <Field name="token_lifetime" component={InputText} type="number" label="Token Expiration (Seconds)" />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <InputText label="Token Issuer" input={{ value: `https://${window.config.AUTH0_DOMAIN}/`, readOnly: true }} />
            </div>
            <div className="col-xs-6">
              <InputText label="Token Audience" input={{ value: 'urn:auth0-authz-api', readOnly: true }} />
            </div>
            <div className="col-xs-12">
              <InputText label="Url" input={{ value: `${path.join(window.config.API_BASE, 'api').replace('https:/', 'https://').replace('http:/', 'http://')}`, readOnly: true }} />
            </div>
          </div>
        </div>);
    }
    return null;
  }

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <div>
        <div data-columns="1" className="switchboard switchboard-responsive">
          { this.renderSwitchItem({
            title: 'API Access',
            description: (<span>By enabling API access an API (Resource Server) will be created in your Auth0 account. This will allow you to define non interactive clients which can access the Authorization API.</span>),
            name: 'apiAccess'
          }) }
        </div>
        { this.renderAPIAccessDetails(this.props.apiAccess) }
        <div className="row">
          <div className="col-xs-12">
            <div className="pull-right">
              <Button bsStyle="primary" disabled={submitting} onClick={handleSubmit}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}, { enableReinitialize: true });

// Decorate with connect to read form values
const selector = formValueSelector('apiAccessForm');
const connectDecorator = connect(state => {
  const apiAccess = selector(state, 'apiAccess');

  return {
    apiAccess
  };
});

export default connectDecorator(apiAccessForm);
