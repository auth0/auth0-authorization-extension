import React, { Component, PropTypes } from 'react';
import { Error, LoadingPanel, Json, Confirm } from 'auth0-extension-ui';
import './ImportExport.styl';

export default class ImportExportTab extends Component {
  static propTypes = {
    exportConfig: PropTypes.func,
    addError: PropTypes.func,
    closeError: PropTypes.func,
    importConfigPrepare: PropTypes.func.isRequired,
    importConfig: PropTypes.func.isRequired,
    closePreview: PropTypes.func.isRequired,
    importExport: PropTypes.object.isRequired,
    error: PropTypes.string,
    loading: PropTypes.object,
    record: PropTypes.object,
    requesting: PropTypes.bool,
    preview: PropTypes.object
  }

  exportConfig = () => {
    const element = document.createElement('a');
    const text = JSON.stringify(this.props.record.toJSON());
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute('download', 'data.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  importConfigOpen = () => {
    this.refs.file.click();
  }

  importConfig = (e) => {
    const file = this.refs.file.files[0];
    if (file) {
      this.props.importConfigPrepare(file);
    }
  }

  confirmImport = () => {
    const preview = this.props.preview;
    this.props.importConfig(preview.toJSON());
  }

  closeImport = () => {
    this.refs.file.value = '';
    this.props.closePreview();
  }

  render() {
    const { error, loading, record, children, requesting, preview } = this.props;
    if (this.props.children) {
      return children;
    }
    return (
      <div>
        <Confirm
          title="Are you sure?" show={requesting} loading={loading}
          onCancel={this.closeImport} onConfirm={this.confirmImport} confirmMessage="Import"
        >
          <Json jsonObject={preview.toJSON()} />
        </Confirm>
        <LoadingPanel show={loading}>
          <Error message={error} onDismiss={this.closeError} dismissAfter={10000} />
          <p>This page allows you to export all of your data to a JSON file, which you can then import in a different environment (eg: moving from <strong>development</strong> to <strong>test</strong>).</p>
          <p>Take into account that roles and permissions are linked to specific clients. If you import these in a different environment, you will need to change the <strong>applicationId</strong> for these records first.</p>
          <Json jsonObject={record.toJSON()} />
          <button className="btn btn-transparent btn-md" onClick={this.exportConfig}>Export</button>
          <button style={{ float: 'right' }} className="btn btn-success" onClick={this.importConfigOpen}>Import</button>
          <input
            ref="file" type="file" id="fileLoader" name="files" title="Load File"
            style={{ display: 'none' }} onChange={this.importConfig.bind(this)}
          />
        </LoadingPanel>
      </div>
    );
  }
}
