import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { importExportActions } from '../actions';
import { Error, LoadingPanel, Json } from '../components/Dashboard';

class ImportExportContainer extends Component {
  componentWillMount() {
    this.props.exportConfig();
  }

  renderLoading = () => {
    return (
      <div className="spinner spinner-lg is-auth0" style={{ margin: '200px auto 0' }}>
        <div className="circle" />
      </div>
    );
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
      let name = file.name;
      let regex = new RegExp("(.*?)\.(json)$");
      if (regex.test(name)) {
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (evt) => {
          let result = JSON.parse(evt.target.result);
          return this.props.importConfig(result);
        }
        reader.onerror = (evt) => {
          this.props.addError('Something went wrong.');
        }
      } else {
        this.props.addError('Incorrect file type.');
      }
    }
  }

  render() {
    const { error, loading, record } = this.props;
    if (this.props.children) {
      return this.props.children;
    }
    return (
      <div>
        <LoadingPanel show={this.props.loading}>
          <Error message={this.props.error} onDismiss={this.closeError} dismissAfter={10000} />
          <Json jsonObject={this.props.record} />
          <button className="btn btn-transparent btn-md" onClick={this.exportConfig}>Export</button>
          <button style={{ float: 'right' }} className="btn btn-success" onClick={this.importConfigOpen}>Import</button>
          <input ref="file" type="file" id="fileLoader" name="files" title="Load File"
                 style={{ display: 'none' }} onChange={this.importConfig.bind(this)} />
        </LoadingPanel>
      </div>
    );
  }
}

ImportExportContainer.propTypes = {
  exportConfig: PropTypes.func,
  addError: PropTypes.func,
  closeError: PropTypes.func,
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
