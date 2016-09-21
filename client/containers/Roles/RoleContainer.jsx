import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class RoleContainer extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <Link className="btn btn-xs btn-default pull-right" to="/roles">
              <i className="icon icon-budicon-257"></i> Back to Roles
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}


export default connect(mapStateToProps, { })(RoleContainer);
