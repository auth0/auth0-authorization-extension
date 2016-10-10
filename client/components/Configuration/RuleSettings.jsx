import React, { PropTypes, Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

import SectionHeader from '../Dashboard/SectionHeader';
import RuleSettingsFrom from './RuleSettingsForm';
import { Error, LoadingPanel } from '../Dashboard';

export default class RuleSettings extends Component {
  static propTypes = {
    configuration: PropTypes.object.isRequired,
    publishRule: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.configuration !== this.props.configuration;
  }

  onSave = (config) => {
    Object.keys(config).forEach(k => {
      if (!config[k]) {
        config[k] = false;
      }
    });

    this.props.onSave(config);
  }

  submitForm = () => {
    this.refs.form.submit();
  }

  render() {
    const { loading, error, record } = this.props.configuration.toJS();

    return (
      <div>
        <SectionHeader
          title="Configuration"
          description="Configure how the authorization extension has to behave during
          a login transaction. This is done by creating a rule in your Auth0 account."
        >
          <Button bsStyle="success" onClick={this.submitForm} disabled={loading}>
            <i className="icon icon-budicon-728" /> Publish Rule
          </Button>
        </SectionHeader>

        <div className="row">
          <div className="col-xs-12">
            <Error message={error} />
            <LoadingPanel show={loading}>
              <RuleSettingsFrom ref="form" initialValues={record} onSubmit={this.onSave} />
            </LoadingPanel>
          </div>
        </div>
      </div>
    );
  }
}
