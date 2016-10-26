import React, { PropTypes, Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Error, LoadingPanel, SectionHeader } from 'auth0-extension-ui';

import RuleConfigurationTab from './RuleConfigurationTab';
import APIAccessTab from './APIAccessTab';

export default class RuleSettings extends Component {
  static propTypes = {
    configuration: PropTypes.object.isRequired,
    saveConfiguration: PropTypes.func.isRequired,
    saveConfigurationResourceServer: PropTypes.func.isRequired,
    removeConfigurationResourceServer: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.onSubmitResourceServer = this.onSubmitResourceServer.bind(this);
  }


  shouldComponentUpdate(nextProps) {
    return nextProps.configuration !== this.props.configuration;
  }

  onSubmitResourceServer(data) {
    if (data && !data.apiAccess) {
      this.props.removeConfigurationResourceServer();
    } else {
      this.props.saveConfigurationResourceServer(data);
    }
  }

  render() {
    const { loading, error, record, resourceserver } = this.props.configuration.toJS();

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
                    <RuleConfigurationTab initialValues={record} onSubmit={this.props.saveConfiguration} />
                  </Tab>
                  <Tab eventKey={2} title="API Access">
                    <APIAccessTab initialValues={resourceserver} onSubmit={this.onSubmitResourceServer} />
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
