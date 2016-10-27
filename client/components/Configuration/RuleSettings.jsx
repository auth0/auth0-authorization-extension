import React, { PropTypes, Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Error, LoadingPanel, SectionHeader } from 'auth0-extension-ui';

import RuleConfigurationTab from './RuleConfigurationTab';
import APIAccessTab from './APIAccessTab';
import ImportExportTab from './ImportExportTab';

export default class RuleSettings extends Component {
  static propTypes = {
    configuration: PropTypes.object.isRequired,
    saveConfiguration: PropTypes.func.isRequired,
    saveConfigurationResourceServer: PropTypes.func.isRequired,
    importConfigPrepare: PropTypes.func.isRequired,
    importConfig: PropTypes.func.isRequired,
    closePreview: PropTypes.func.isRequired,
    importExport: PropTypes.object.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.configuration !== this.props.configuration || nextProps.importExport !== this.props.importExport;
  }

  render() {
    const { loading, error, record, resourceserver, activeTab } = this.props.configuration.toJS();
    const importExport = this.props.importExport;
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
