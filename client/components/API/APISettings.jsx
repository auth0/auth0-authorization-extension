import React, { PropTypes, Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Error, LoadingPanel, SectionHeader } from 'auth0-extension-ui';

import APIAccessTab from './APIAccessTab';

export default class RuleSettings extends Component {
  static propTypes = {
    configuration: PropTypes.object.isRequired,
    saveConfigurationResourceServer: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.configuration !== this.props.configuration;
  }

  render() {
    const { loading, error, resourceserver } = this.props.configuration.toJS();
    const initialValues = { token_lifetime: 86400, ...(resourceserver || { }) };
    return (
      <div>
        <SectionHeader
          title="API"
          description="The Authorization Dashboard can optionally enable API access which will allow you to automate provisioning and query the authorization context of your users in real time."
        />
        <div className="row">
          <div className="col-xs-12">
            <Error message={error} />
            <LoadingPanel show={loading}>
              <div>
                <Tabs animation={false}>
                  <Tab eventKey={1} title="Settings">
                    <APIAccessTab initialValues={initialValues} onSubmit={this.props.saveConfigurationResourceServer} />
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
