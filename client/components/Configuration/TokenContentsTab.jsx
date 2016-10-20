import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Field } from 'redux-form';
import { InputSwitchItem } from 'auth0-extension-ui';
import createForm from '../../utils/createForm';

export default createForm('tokenContentsForm', class TokenContentsForm extends Component {
  constructor(props) {
    super(props);
    this.tabSwitchItems = [
      {
        title: 'Groups',
        description: (<span>Add <strong>groups</strong> to the user's token.</span>),
        name: 'groupsInToken'
      },
      {
        title: 'Roles',
        description: (<span>Add <strong>roles</strong> to the user's token.</span>),
        name: 'rolesInToken'
      },
      {
        title: 'Permissions',
        description: (<span>Add <strong>permissions</strong> to the user's token.</span>),
        name: 'permissionsInToken'
      }
    ];
  }
  static propTypes = {
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired
  }

  renderSwitchItem(field) {
    return <Field name={field.name} component={InputSwitchItem} title={field.title} description={field.description} />;
  }

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <div>
        <div className="cues-container">
          <div className="use-case-box is-active">
            <div className="explainer-text">
              <span className="explainer-text-content">
                Authorization data like groups, roles and permissions can be stored in the outgoing token issued by Auth0.
                Your application can then consume this information by inspecting the token and take appropriate actions based on the user's current authorization context.
              </span>
            </div>
          </div>
        </div>
        <div data-columns="3" className="switchboard switchboard-responsive">
          { this.tabSwitchItems.map(item => this.renderSwitchItem(item)) }
        </div>

        <div className="alert alert-info">
          <strong>Heads up!</strong> Storing too much data in the token can cause performance issues or even prevent the token to be issued.
          Make sure you only choose to store the data that you'll really need.
          If this data can grow too large, consider using persistence instead of adding it to the token.
        </div>

        <div className="cues-container">
          <div className="use-case-box is-active">
            <div className="explainer-text">
              <span className="explainer-text-content">
                You might have users that receive groups from the IdP (eg: Active Directory).
                If you want to merge these groups (in order to preserve them) with the groups defined in the Authorization Extesion make sure you enable the following option.
              </span>
            </div>
          </div>
        </div>

        <div data-columns="1" className="switchboard switchboard-responsive">
          { this.renderSwitchItem({
            title: 'Groups Passthrough',
            description: (<span>Merge the user's groups with groups originating from the IdP.</span>),
            name: 'groupsPassthrough'
          }) }
        </div>

        <div className="pull-right">
          <Button bsStyle="primary" disabled={submitting} onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </div>
    );
  }
});
