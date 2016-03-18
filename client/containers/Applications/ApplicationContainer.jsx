import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';

import { applicationActions } from '../../actions';

import ApplicationDetail from '../../components/Applications/ApplicationDetail';
import ApplicationHeader from '../../components/Applications/ApplicationHeader';

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
                <p>Groups</p>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

ApplicationContainer.propTypes = {
  application: React.PropTypes.object,
  params: React.PropTypes.object.isRequired,
  fetchApplication: React.PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, { ...applicationActions })(ApplicationContainer);
