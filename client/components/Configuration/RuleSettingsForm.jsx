import React, { Component, PropTypes } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Field } from 'redux-form';
import createForm from '../../utils/createForm';

export default createForm('ruleSettingsToken', class extends Component {

  renderSwitchItem(item) {
    return (
    <div tabIndex="-1" data-switch-position="left" className="switchboard-item disabled">
      <div className="content">
        <h4 className="name">{item.title}</h4>
        <div className="desc">{item.description}</div>
      </div>
      <div className="switch">
        <div className="ui-switch">
          <Field name={item.name} component="input" type="checkbox" /><span className="status" />
        </div>
      </div>
    </div>);
  }

  render() {
    const tabSwitchItems = {
      tokenContents: [
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
      ],
      persistence: [
        {
          title: 'Groups',
          description: (<span>Persist <strong>groups</strong> in the user's application metadata.</span>),
          name: 'persistGroups'
        },
        {
          title: 'Roles',
          description: (<span>Persist <strong>roles</strong> in the user's application metadata.</span>),
          name: 'persistRoles'
        },
        {
          title: 'Permissions',
          description: (<span>Persist <strong>description</strong> in the user's application metadata.</span>),
          name: 'persistPermissions'
        }
      ]
    };

    return (
      <div>
        <Tabs defaultActiveKey={1} animation={false}>
          <Tab eventKey={1} title="Token Contents">
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
                { tabSwitchItems.tokenContents.map(item => this.renderSwitchItem(item)) }
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
            </div>
          </Tab>
          <Tab eventKey={2} title="Persistence">
            <div>
              <div className="cues-container">
                <div className="use-case-box is-active">
                  <div className="explainer-text">
                    <span className="explainer-text-content">
                      In addition to storing the authorization context in the token you can also choose to persist the information in the user profile.
                      This is especially useful if your authorization context is pretty large (eg: many groups or many permissions).
                      The data will be stored in the user's app_metadata and you can then use the Management API or the Token Info endpoint to retrieve this information after the user has logged in.
                    </span>
                  </div>
                </div>
              </div>

              <div data-columns="3" className="switchboard switchboard-responsive">
                { tabSwitchItems.persistence.map(item => this.renderSwitchItem(item)) }
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
});
