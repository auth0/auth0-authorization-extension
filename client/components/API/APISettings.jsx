import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import { Error, LoadingPanel, SectionHeader } from '@a0/auth0-extension-ui';

import APIAccessTab from './APIAccessTab';
import APIExplorerTab from './APIExplorerTab';

import apiExplorer from './apiExplorer.json';

export default class RuleSettings extends Component {
  static propTypes = {
    configuration: PropTypes.object.isRequired,
    saveConfigurationResourceServer: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.configuration !== this.props.configuration;
  }

  render() {
    const { loading, error, resourceserver } =
      this.props.configuration.toJS();
    const initialValues = { token_lifetime: 86400, ...(resourceserver || {}) };
    // redux-form's mid-render reinitialize is dropped under React 18, so keying
    // the form on the fetched payload remounts it to seed values via the
    // constructor. See APIAccessTab for the paired destroyOnUnmount:false.
    const formKey = JSON.stringify(resourceserver || {});

    // no longer generated from hapi-swagger, now static json
    const explorer = apiExplorer;

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
                <Tabs>
                  <Tab eventKey={1} title="Settings">
                    <APIAccessTab
                      key={formKey}
                      initialValues={initialValues}
                      onSubmit={this.props.saveConfigurationResourceServer}
                    />
                  </Tab>
                  <Tab eventKey={2} title="Explorer">
                    <APIExplorerTab explorer={explorer} />
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
