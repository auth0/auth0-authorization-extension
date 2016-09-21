import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';

import { applicationActions, applicationGroupActions, groupPickerActions } from '../../actions';

import ApplicationDetail from '../../components/Applications/ApplicationDetail';
import ApplicationHeader from '../../components/Applications/ApplicationHeader';
import ApplicationGroups from '../../components/Applications/ApplicationGroups';
import ApplicationGroupRemoveDialog from '../../components/Applications/ApplicationGroupRemoveDialog';

import { GroupPickerDialog } from '../../components/Groups';

class ApplicationContainer extends Component {
  constructor() {
    super();

    this.requestAddApplicationGroup = this.requestAddApplicationGroup.bind(this);
    this.addApplicationGroup = this.addApplicationGroup.bind(this);
  }

  componentWillMount() {
    this.props.fetchApplication(this.props.params.id);
  }

  requestAddApplicationGroup(application) {
    this.props.openGroupPicker(`Add a group to ${application.name}`);
  }

  addApplicationGroup(group) {
    this.props.cancelGroupPicker();

    const clientId = this.props.application.get('record').get('client_id');
    this.props.addApplicationGroup(clientId, group._id, () => {
      this.props.fetchApplicationGroups(clientId, true);
    });
  }

  render() {
    const { application, groupPicker } = this.props;

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
                <ApplicationGroups application={application.get('record')} groups={application.get('groups')}
                  addToApplication={this.requestAddApplicationGroup} removeFromApplication={this.props.requestRemoveApplicationGroup}
                />
              </Tab>
            </Tabs>
          </div>
        </div>
        <div>
          <GroupPickerDialog groupPicker={groupPicker}
            onConfirm={this.addApplicationGroup} onCancel={this.props.cancelGroupPicker}
          />
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
  groupPicker: PropTypes.object,
  params: PropTypes.object.isRequired,
  fetchApplication: PropTypes.func.isRequired,
  fetchApplicationGroups: PropTypes.func.isRequired,
  requestRemoveApplicationGroup: PropTypes.func.isRequired,
  cancelRemoveApplicationGroup: PropTypes.func.isRequired,
  removeApplicationGroup: PropTypes.func.isRequired,
  openGroupPicker: PropTypes.func.isRequired,
  cancelGroupPicker: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    application: state.application,
    applicationGroup: state.applicationGroup,
    groupPicker: state.groupPicker
  };
}


export default connect(mapStateToProps, { ...applicationActions, ...applicationGroupActions, ...groupPickerActions })(ApplicationContainer);
