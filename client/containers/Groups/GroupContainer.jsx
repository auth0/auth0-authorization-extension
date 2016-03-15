import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';

import * as actions from '../../actions/group';
import { GroupHeader, GroupMembers } from '../../components/Groups';

export default class GroupContainer extends Component {
  componentWillMount() {
    this.props.fetchGroup(this.props.params.id);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.group !== this.props.group;
  }

  render() {
    const group = this.props.group.toJS();

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <Link className="btn btn-xs btn-default pull-right" to="/groups">
              <i className="icon icon-budicon-257"></i> Back to Groups
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <GroupHeader loading={group.loading} group={group.record} error={group.error} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <Tabs defaultActiveKey={1} animation={false}>
              <Tab eventKey={1} title="Members">
                <GroupMembers loading={group.loading} group={group.record} error={group.error} />
              </Tab>
              <Tab eventKey={2} title="Mappings">
                <GroupMembers loading={group.loading} group={group.record} error={group.error} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

GroupContainer.propTypes = {
  group: React.PropTypes.object,
  params: React.PropTypes.object.isRequired,
  fetchGroup: React.PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    group: state.group
  };
}

export default connect(mapStateToProps, actions)(GroupContainer);
