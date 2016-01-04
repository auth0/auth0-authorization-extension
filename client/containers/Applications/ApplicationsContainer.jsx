import { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';

import * as actions from '../../actions/application';
import { Error, LoadingPanel } from '../../components/Dashboard';
import ApplicationsTable from '../../components/Applications/ApplicationsTable';

class ApplicationsContainer extends Component {
  componentWillMount() {
    this.props.fetchApplications();
  }

  refresh() {
    this.props.fetchApplications(true);
  }

  render() {
    const { applications, error, loading } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <ButtonToolbar className="pull-right">
              <Button bsSize="xsmall" onClick={this.refresh.bind(this)} disabled={loading}>
                <i className="icon icon-budicon-257"></i> Refresh
              </Button>
            </ButtonToolbar>
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
