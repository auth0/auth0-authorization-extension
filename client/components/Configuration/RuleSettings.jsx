import React, { PropTypes, Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import SectionHeader from '../Dashboard/SectionHeader';
import { Error, LoadingPanel } from '../Dashboard';
import RuleConfigurationTab from './RuleConfigurationTab';
import APIAccessTab from './APIAccessTab';

export default class RuleSettings extends Component {
  static propTypes = {
    configuration: PropTypes.object.isRequired,
    saveConfigurationRuleConfiguration: PropTypes.func.isRequired,
    saveConfigurationAPIAccess: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.configuration !== this.props.configuration;
  }

  render() {
    const { loading, error, record } = this.props.configuration.toJS();

    return (
      <div>
        <SectionHeader
          title="Configuration"
          description="Configure how the authorization extension has to behave during
          a login transaction. This is done by creating a rule in your Auth0 account."
        />

        <div className="row">
          <div className="col-xs-12">
            <Error message={error} />
            <LoadingPanel show={loading}>
              <div>
                <Tabs defaultActiveKey={1} animation={false}>
                  <Tab eventKey={1} title="Rule Configuration">
                    <RuleConfigurationTab initialValues={record} onSubmit={this.props.saveConfigurationRuleConfiguration} />
                  </Tab>
                  <Tab eventKey={2} title="API Access">
                    <APIAccessTab initialValues={record} onSubmit={this.props.saveConfigurationAPIAccess} />
                  </Tab>
                </Tabs>
              </div>
            </LoadingPanel>
          </div>
        </div>
      </div>
    );
  }
}
