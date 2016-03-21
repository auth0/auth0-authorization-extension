import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';

import { applicationActions, applicationGroupActions } from '../../actions';

import ApplicationDetail from '../../components/Applications/ApplicationDetail';
import ApplicationHeader from '../../components/Applications/ApplicationHeader';
import ApplicationGroups from '../../components/Applications/ApplicationGroups';
import ApplicationGroupRemoveDialog from '../../components/Applications/ApplicationGroupRemoveDialog';

export default class ApplicationContainer extends Component {
  componentWillMount() {
    this.props.fetchApplication(this.props.params.id);
  }

  render() {
    const { application } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <Link className="btn btn-xs btn-default pull-right" to="/applications">
              <i className="icon icon-budicon-257"></i> Back to Applications
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <ApplicationHeader application={application} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <Tabs defaultActiveKey={1} animation={false}>
              <Tab eventKey={1} title="Details">
                <ApplicationDetail application={application} />
              </Tab>
              <Tab eventKey={2} title="Groups">
                <ApplicationGroups application={application.get('record')} groups={application.get('groups')} removeFromApplication={this.props.requestRemoveApplicationGroup} />
              </Tab>
            </Tabs>
          </div>
        </div>
        <div>
          <ApplicationGroupRemoveDialog applicationGroup={this.props.applicationGroup}
            onConfirm={this.props.removeApplicationGroup} onCancel={this.props.cancelRemoveApplicationGroup}
          />
        </div>
      </div>
    );
  }
}

ApplicationContainer.propTypes = {
  application: PropTypes.object,
  applicationGroup: PropTypes.object,
  params: PropTypes.object.isRequired,
  fetchApplication: PropTypes.func.isRequired,
  requestRemoveApplicationGroup: PropTypes.func.isRequired,
  cancelRemoveApplicationGroup: PropTypes.func.isRequired,
  removeApplicationGroup: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    application: state.application,
    applicationGroup: state.applicationGroup
  };
}


export default connect(mapStateToProps, { ...applicationActions, ...applicationGroupActions })(ApplicationContainer);
