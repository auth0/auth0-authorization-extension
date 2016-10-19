import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { importExportActions } from '../actions';
import { Error, LoadingPanel, Json } from '../components/Dashboard';

class ImportExportContainer extends Component {
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

  render() {
    const { error, loading, record } = this.props;
    if (this.props.children) {
      return this.props.children;
    }
    return (
      <div>
        <LoadingPanel show={loading}>
          <Error message={error} onDismiss={this.closeError} dismissAfter={10000} />
          <Json jsonObject={record} />
          <button className="btn btn-transparent btn-md" onClick={this.exportConfig}>Export</button>
          <button style={{float: 'right'}} className="btn btn-success" onClick={this.importConfigOpen}>Import</button>
          <input ref="file" type="file" id="fileLoader" name="files" title="Load File"
                 style={{display: 'none'}} onChange={this.importConfig.bind(this)} />
        </LoadingPanel>
      </div>
    );
  }
}

ImportExportContainer.propTypes = {
  exportConfig: PropTypes.func,
  addError: PropTypes.func,
  closeError: PropTypes.func,
  importConfigPrepare: PropTypes.func,
  importConfig: PropTypes.func
};

function mapStateToProps(state) {
  return {
    error: state.importExport.get('error'),
    loading: state.importExport.get('loading'),
    record: state.importExport.get('record')
  };
}

export default connect(mapStateToProps, { ...importExportActions })(ImportExportContainer);
