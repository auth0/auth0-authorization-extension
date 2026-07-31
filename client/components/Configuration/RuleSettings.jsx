import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import { Error, LoadingPanel, SectionHeader } from '@a0/auth0-extension-ui';

import RuleConfigurationTab from './RuleConfigurationTab';
import ImportExportTab from './ImportExportTab';

export default class RuleSettings extends Component {
  static propTypes = {
    configuration: PropTypes.object.isRequired,
    rotateApiKey: PropTypes.func.isRequired,
    saveConfiguration: PropTypes.func.isRequired,
    importConfigPrepare: PropTypes.func.isRequired,
    importConfig: PropTypes.func.isRequired,
    closePreview: PropTypes.func.isRequired,
    importExport: PropTypes.object.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.configuration !== this.props.configuration || nextProps.importExport !== this.props.importExport;
  }

  render() {
    const { loading, error, record, hash, activeTab } = this.props.configuration.toJS();
    const importExport = this.props.importExport;
    // See APISettings: key the form on the fetched record to remount it so
    // redux-form seeds the toggles via the constructor under React 18.
    const formKey = JSON.stringify(record || {});
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
                <Tabs id="tabs" defaultActiveKey={activeTab}>
                  <Tab eventKey={1} title="Rule Configuration">
                    <RuleConfigurationTab key={formKey} initialValues={record} hash={hash} onSubmit={this.props.saveConfiguration} rotateApiKey={this.props.rotateApiKey} />
                  </Tab>
                  <Tab eventKey={2} title="Import / Export">
                    <ImportExportTab
                      importConfigPrepare={this.props.importConfigPrepare}
                      importConfig={this.props.importConfig}
                      closePreview={this.props.closePreview}
                      importExport={this.props.importExport}
                      error={importExport.get('error')}
                      loading={importExport.get('loading')}
                      record={importExport.get('record')}
                      requesting={importExport.get('requesting')}
                      preview={importExport.get('preview')}
                    />
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
