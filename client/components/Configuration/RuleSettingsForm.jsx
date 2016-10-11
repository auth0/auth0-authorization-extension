import React, { Component, PropTypes } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import createForm from '../../utils/createForm';

export default createForm('ruleSettingsToken', class extends Component {
  static propTypes = {
    fields: PropTypes.object
  }

  static formFields = [
    'groupsInToken', 'rolesInToken', 'permissionsInToken',
    'persistGroups', 'persistRoles', 'persistPermissions',
    'groupsPassthrough'
  ]

  render() {
    const { fields } = this.props;

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
                <div tabIndex="-1" data-switch-position="left" className="switchboard-item disabled">
                  <div className="content">
                    <h4 className="name">Groups</h4>
                    <div className="desc">Add <strong>groups</strong> to the user's token.</div>
                  </div>
                  <div className="switch">
                    <div className="ui-switch">
                      <input type="checkbox" {...fields.groupsInToken} /><span className="status"></span>
                    </div>
                  </div>
                </div>
                <div tabIndex="-1" data-switch-position="left" className="switchboard-item disabled">
                  <div className="content">
                    <h4 className="name">Roles</h4>
                    <div className="desc">Add <strong>roles</strong> to the user's token.</div>
                  </div>
                  <div className="switch">
                    <div className="ui-switch">
                      <input type="checkbox" {...fields.rolesInToken} /><span className="status"></span>
                    </div>
                  </div>
                </div>
                <div tabIndex="-1" data-switch-position="left" className="switchboard-item disabled">
                  <div className="content">
                    <h4 className="name">Permissions</h4>
                    <div className="desc">Add <strong>permissions</strong> to the user's token.</div>
                  </div>
                  <div className="switch">
                    <div className="ui-switch">
                      <input type="checkbox" {...fields.permissionsInToken} /><span className="status"></span>
                    </div>
                  </div>
                </div>
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
                <div tabIndex="-1" data-switch-position="left" className="switchboard-item disabled">
                  <div className="content">
                    <h4 className="name">Groups Passthrough</h4>
                    <div className="desc">Merge the user's groups with groups originating from the IdP.</div>
                  </div>
                  <div className="switch">
                    <div className="ui-switch">
                      <input type="checkbox" {...fields.groupsPassthrough} /><span className="status"></span>
                    </div>
                  </div>
                </div>
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
                <div tabIndex="-1" data-switch-position="left" className="switchboard-item disabled">
                  <div className="content">
                    <h4 className="name">Groups</h4>
                    <div className="desc">Persist <strong>groups</strong> in the user's application metadata.</div>
                  </div>
                  <div className="switch">
                    <div className="ui-switch">
                      <input type="checkbox" {...fields.persistGroups} /><span className="status"></span>
                    </div>
                  </div>
                </div>
                <div tabIndex="-1" data-switch-position="left" className="switchboard-item disabled">
                  <div className="content">
                    <h4 className="name">Roles</h4>
                    <div className="desc">Persist <strong>roles</strong> in the user's application metadata.</div>
                  </div>
                  <div className="switch">
                    <div className="ui-switch">
                      <input type="checkbox" {...fields.persistRoles} /><span className="status"></span>
                    </div>
                  </div>
                </div>
                <div tabIndex="-1" data-switch-position="left" className="switchboard-item disabled">
                  <div className="content">
                    <h4 className="name">Permissions</h4>
                    <div className="desc">Persist <strong>permissions</strong> in the user's application metadata.</div>
                  </div>
                  <div className="switch">
                    <div className="ui-switch">
                      <input type="checkbox" {...fields.persistPermissions} /><span className="status"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
});
