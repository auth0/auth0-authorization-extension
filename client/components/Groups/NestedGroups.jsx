import React, { Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

import { LoadingPanel, Error } from '../Dashboard';
import GroupsTable from './GroupsTable';
import NestedGroupRemoveAction from './NestedGroupRemoveAction';

class NestedGroups extends Component {
  constructor() {
    super();
    this.renderActions = this.renderActions.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.nested !== this.props.nested;
  }

  renderActions(group, index) {
    return <NestedGroupRemoveAction index={index} group={group} loading={this.props.nested.get('loading')} onRemove={this.props.removeNestedGroup} />;
  }

  render() {
    const { records, loading, error } = this.props.nested.toJS();

    return (
      <div>
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12">
              <Error message={error} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-8">
              <p>
                Add nested groups (sub groups) to this group.
                All members of these nested groups will automatically become members of this group also.
              </p>
            </div>
            <div className="col-xs-4">
              <Button className="pull-right" bsStyle="success" onClick={this.props.addNestedGroup} disabled={loading}>
                <i className="icon icon-budicon-473" /> Add nested group
              </Button>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <GroupsTable
                canOpenGroup groups={this.props.nested.get('records')}
                loading={loading} renderActions={this.renderActions}
              />
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}

NestedGroups.propTypes = {
  addNestedGroup: React.PropTypes.func.isRequired,
  removeNestedGroup: React.PropTypes.func.isRequired,
  nested: React.PropTypes.object.isRequired
};

export default NestedGroups;
