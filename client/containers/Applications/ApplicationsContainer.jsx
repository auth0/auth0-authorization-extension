import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/application';
import { Error, LoadingPanel } from '../../components/Dashboard';
import ApplicationsTable from '../../components/Applications/ApplicationsTable';

class ApplicationsContainer extends Component {
  componentWillMount() {
    this.props.fetchApplications();
  }

  render() {
    if (this.props.children) {
      return this.props.children;
    }

    const { applications, error, loading } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <div className="content-header">
              <h1>Applications</h1>
              <div className="cues-container">
                <div className="use-case-box is-active">
                  <div className="explainer-text">
                    <span className="explainer-text-content">For applications you are able to decide if all users have access or if access is restricted to users that belong to specific groups.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <Error message={error} />
            <LoadingPanel show={loading}>
              <ApplicationsTable loading={loading} applications={applications} />
            </LoadingPanel>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.applications.get('error'),
    loading: state.applications.get('loading'),
    applications: state.applications.get('records')
  };
}

export default connect(mapStateToProps, actions)(ApplicationsContainer);
