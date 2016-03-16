import React, { Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

import { LoadingPanel, Error } from '../Dashboard';

class GroupMappings extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.mappings !== this.props.mappings;
  }

  render() {
    const { records, loading, error } = this.props.mappings.toJS();

    return (
      <div>
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={error} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-10">
              <span className="pull-left">Mappings allow you to define which existing group memberships (eg: Active Directory) should be translated to this group.</span>
            </div>
            <div className="col-xs-2">
              <ButtonToolbar className="pull-right">
                <Button bsStyle="primary" bsSize="xsmall" onClick={this.props.createMapping} disabled={loading}>
                  <i className="icon icon-budicon-337"></i> Create
                </Button>
              </ButtonToolbar>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}

GroupMappings.propTypes = {
  createMapping: React.PropTypes.func.isRequired,
  removeMapping: React.PropTypes.func.isRequired,
  mappings: React.PropTypes.object.isRequired
};

export default GroupMappings;
