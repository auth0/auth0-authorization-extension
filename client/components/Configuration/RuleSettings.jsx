import React, { PropTypes, Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

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
        <div className="row">
          <div className="col-xs-12 wrapper">
            <div className="content-header video-template">
              <ButtonToolbar className="pull-right">
                <Button bsStyle="success" bsSize="large" onClick={this.submitForm} disabled={loading}>
                  <i className="icon icon-budicon-728"></i> Publish Rule
                </Button>
              </ButtonToolbar>
              <h1>Configuration</h1>
              <div className="cues-container">
                <div className="use-case-box is-active">
                  <div className="explainer-text">
                    <span className="explainer-text-content">
                      Configure how the authorization extension has to behave during a login transaction. This is done by creating a rule in your Auth0 account.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 wrapper">
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
