import React, { PropTypes, Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Error, LoadingPanel, SectionHeader } from 'auth0-extension-ui';

import RuleConfigurationTab from './RuleConfigurationTab';
import APIAccessTab from './APIAccessTab';
import ImportExport from './ImportExport';

export default class RuleSettings extends Component {
  static propTypes = {
    configuration: PropTypes.object.isRequired,
    saveConfiguration: PropTypes.func.isRequired,
    saveConfigurationResourceServer: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.configuration !== this.props.configuration;
  }

  render() {
    const { loading, error, record, resourceserver, activeTab } = this.props.configuration.toJS();
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
                <Tabs defaultActiveKey={activeTab} animation={false}>
                  <Tab eventKey={1} title="Rule Configuration">
                    <RuleConfigurationTab initialValues={record} onSubmit={this.props.saveConfiguration} />
                  </Tab>
                  <Tab eventKey={2} title="API Access">
                    <APIAccessTab initialValues={resourceserver} onSubmit={this.props.saveConfigurationResourceServer} />
                  </Tab>
                  <Tab eventKey={3} title="Import / Export">
                    <ImportExport />
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
