import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/importExport';
import { Error, LoadingPanel, Json, Confirm } from 'auth0-extension-ui';
import './ImportExport.styl';

class ImportExport extends Component {
  static propTypes = {
    exportConfig: PropTypes.func,
    addError: PropTypes.func,
    closeError: PropTypes.func,
    importConfigPrepare: PropTypes.func,
    closePreview: PropTypes.func,
    importConfig: PropTypes.func
  }

  componentDidMount() {
    this.props.exportConfig();
  }

  exportConfig = () => {
    var element = document.createElement('a');
    let text = JSON.stringify(this.props.record.toJSON());
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
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
    var file = this.refs.file.files[0];
    if (file) {
      this.props.importConfigPrepare(file);
    }
  }

  confirmImport = () => {
    const preview = this.props.preview;
    this.props.importConfig(preview.toJSON())
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
        <Confirm title='Are you sure?' show={ requesting } loading={ loading }
                 onCancel={ this.closeImport } onConfirm={ this.confirmImport } confirmMessage="Import">
          <Json jsonObject={preview.toJSON()} />
        </Confirm>
        <LoadingPanel show={loading}>
          <Error message={error} onDismiss={this.closeError} dismissAfter={10000} />
          <Json jsonObject={record.toJSON()} />
          <button className="btn btn-transparent btn-md" onClick={this.exportConfig}>Export</button>
          <button style={{ float: 'right' }} className="btn btn-success" onClick={this.importConfigOpen}>Import</button>
          <input ref="file" type="file" id="fileLoader" name="files" title="Load File"
                 style={{ display: 'none' }} onChange={this.importConfig.bind(this)} />
        </LoadingPanel>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    error: state.importExport.get('error'),
    loading: state.importExport.get('loading'),
    record: state.importExport.get('record'),
    requesting: state.importExport.get('requesting'),
    preview: state.importExport.get('preview')
  }
}
export default connect(mapStateToProps, actions)(ImportExport);