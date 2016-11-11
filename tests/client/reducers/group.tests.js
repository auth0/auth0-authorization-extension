import expect from 'expect';
import { group } from '../../../client/reducers/group';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  record: {},
  groupId: null,
  isNew: false,
  isEdit: false,
  isEditUsers: false,
  isDelete: false,
  requesting: false,
  validationErrors: {},
  addRoles: false,
  members: {
    loading: false,
    error: null,
    records: []
  },
  nestedMembers: {
    loading: false,
    error: null,
    records: []
  },
  mappings: {
    loading: false,
    error: null,
    records: []
  },
  nested: {
    loading: false,
    error: null,
    records: []
  }
};

describe('group reducer', () => {
  it('should return the initial state', () => {
    expect(
      group(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_GROUP_PENDING', () => {
    expect(
      group(initialState, {
        type: constants.FETCH_GROUP_PENDING,
        meta: {
          groupId: 1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {},
        groupId: 1,
        isNew: false,
        isEdit: false,
        isEditUsers: false,
        isDelete: false,
        requesting: false,
        validationErrors: {},
        addRoles: false,
        members: {
          loading: false,
          error: null,
          records: []
        },
        nestedMembers: {
          loading: false,
          error: null,
          records: []
        },
        mappings: {
          loading: false,
          error: null,
          records: []
        },
        nested: {
          loading: false,
          error: null,
          records: []
        }
      }
    );
  });

  it('should handle FETCH_GROUP_REJECTED', () => {
    expect(
      group(initialState, {
        type: constants.FETCH_GROUP_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the user: ERROR',
        record: {},
        groupId: null,
        isNew: false,
        isEdit: false,
        isEditUsers: false,
        isDelete: false,
        requesting: false,
        validationErrors: {},
        addRoles: false,
        members: {
          loading: false,
          error: null,
          records: []
        },
        nestedMembers: {
          loading: false,
          error: null,
          records: []
        },
        mappings: {
          loading: false,
          error: null,
          records: []
        },
        nested: {
          loading: false,
          error: null,
          records: []
        }
      }
    );
  });

  it('should handle FETCH_CONNECTIONS_FULFILLED with _id==groupId', () => {
    expect(
      group({
        loading: false,
        error: null,
        record: {},
        groupId: 1,
        isNew: false,
        isEdit: false,
        isEditUsers: false,
        isDelete: false,
        requesting: false,
        validationErrors: {},
        addRoles: false,
        members: {
          loading: false,
          error: null,
          records: []
        },
        nestedMembers: {
          loading: false,
          error: null,
          records: []
        },
        mappings: {
          loading: false,
          error: null,
          records: []
        },
        nested: {
          loading: false,
          error: null,
          records: []
        }
      }, {
        type: constants.FETCH_CONNECTIONS_FULFILLED,
        payload: {
          data: [
            {
              _id: 1,
              name: 'test'
            }
          ]
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {},
        groupId: 1,
        isNew: false,
        isEdit: false,
        isEditUsers: false,
        isDelete: false,
        requesting: false,
        validationErrors: {},
        addRoles: false,
        members: {
          loading: false,
          error: null,
          records: []
        },
        nestedMembers: {
          loading: false,
          error: null,
          records: []
        },
        mappings: {
          loading: false,
          error: null,
          records: []
        },
        nested: {
          loading: false,
          error: null,
          records: []
        }
      }
    );
  });

  it('should handle FETCH_CONNECTIONS_FULFILLED with _id!=groupId', () => {
    expect(
      group({
        loading: false,
        error: null,
        record: {},
        groupId: 1,
        isNew: false,
        isEdit: false,
        isEditUsers: false,
        isDelete: false,
        requesting: false,
        validationErrors: {},
        addRoles: false,
        members: {
          loading: false,
          error: null,
          records: []
        },
        nestedMembers: {
          loading: false,
          error: null,
          records: []
        },
        mappings: {
          loading: false,
          error: null,
          records: []
        },
        nested: {
          loading: false,
          error: null,
          records: []
        }
      }, {
        type: constants.FETCH_CONNECTIONS_FULFILLED,
        payload: {
          data: [
            {
              _id: 2,
              name: 'test'
            }
          ]
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {},
        groupId: 1,
        isNew: false,
        isEdit: false,
        isEditUsers: false,
        isDelete: false,
        requesting: false,
        validationErrors: {},
        addRoles: false,
        members: {
          loading: false,
          error: null,
          records: []
        },
        nestedMembers: {
          loading: false,
          error: null,
          records: []
        },
        mappings: {
          loading: false,
          error: null,
          records: []
        },
        nested: {
          loading: false,
          error: null,
          records: []
        }
      }
    );
  });


  it('should handle CLEAR_GROUP', () => {
    expect(
      group(initialState, {
        type: constants.CLEAR_GROUP
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle CREATE_GROUP', () => {
    expect(
      group(initialState, {
        type: constants.CREATE_GROUP
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {},
        groupId: null,
        isNew: true,
        isEdit: false,
        isEditUsers: false,
        isDelete: false,
        requesting: false,
        validationErrors: {},
        addRoles: false,
        members: {
          loading: false,
          error: null,
          records: []
        },
        nestedMembers: {
          loading: false,
          error: null,
          records: []
        },
        mappings: {
          loading: false,
          error: null,
          records: []
        },
        nested: {
          loading: false,
          error: null,
          records: []
        }
      }
    );
  });

  it('should handle EDIT_GROUP', () => {
    expect(
      group(initialState, {
        type: constants.EDIT_GROUP,
        payload: {
          group: {
            _id: 1,
            name: 'test'
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {
          _id: 1,
          name: 'test'
        },
        groupId: 1,
        isNew: false,
        isEdit: true,
        isEditUsers: false,
        isDelete: false,
        requesting: false,
        validationErrors: {},
        addRoles: false,
        members: {
          loading: false,
          error: null,
          records: []
        },
        nestedMembers: {
          loading: false,
          error: null,
          records: []
        },
        mappings: {
          loading: false,
          error: null,
          records: []
        },
        nested: {
          loading: false,
          error: null,
          records: []
        }
      }
    );
  });

  it('should handle EDIT_GROUP_USERS', () => {
    expect(
      group(initialState, {
        type: constants.EDIT_GROUP_USERS,
        payload: {
          group: {
            _id: 1,
            name: 'test'
          },
          group_id: 1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {
          _id: 1,
          name: 'test'
        },
        groupId: 1,
        isNew: false,
        isEdit: false,
        isEditUsers: true,
        isDelete: false,
        requesting: false,
        validationErrors: {},
        addRoles: false,
        members: {
          loading: false,
          error: null,
          records: []
        },
        nestedMembers: {
          loading: false,
          error: null,
          records: []
        },
        mappings: {
          loading: false,
          error: null,
          records: []
        },
        nested: {
          loading: false,
          error: null,
          records: []
        }
      }
    );
  });

  it('should handle SAVE_GROUP_PENDING', () => {
    expect(
      group(initialState, {
        type: constants.SAVE_GROUP_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {},
        groupId: null,
        isNew: false,
        isEdit: false,
        isEditUsers: false,
        isDelete: false,
        requesting: false,
        validationErrors: {},
        addRoles: false,
        members: {
          loading: false,
          error: null,
          records: []
        },
        nestedMembers: {
          loading: false,
          error: null,
          records: []
        },
        mappings: {
          loading: false,
          error: null,
          records: []
        },
        nested: {
          loading: false,
          error: null,
          records: []
        }
      }
    );
  });

  it('should handle SAVE_GROUP_REJECTED with error payload', () => {
    expect(
      group(initialState, {
        type: constants.SAVE_GROUP_REJECTED,
        payload: {
          data: {
            errors: { field_1: 'test' }
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while saving the group: Validation Error',
        record: {},
        groupId: null,
        isNew: false,
        isEdit: false,
        isEditUsers: false,
        isDelete: false,
        requesting: false,
        validationErrors: { field_1: 'test' },
        addRoles: false,
        members: {
          loading: false,
          error: null,
          records: []
        },
        nestedMembers: {
          loading: false,
          error: null,
          records: []
        },
        mappings: {
          loading: false,
          error: null,
          records: []
        },
        nested: {
          loading: false,
          error: null,
          records: []
        }
      }
    );
  });

  it('should handle SAVE_GROUP_REJECTED without error payload', () => {
    expect(
      group(initialState, {
        type: constants.SAVE_GROUP_REJECTED,
        payload: {}
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while saving the group: Validation Error',
        record: {},
        groupId: null,
        isNew: false,
        isEdit: false,
        isEditUsers: false,
        isDelete: false,
        requesting: false,
        validationErrors: {},
        addRoles: false,
        members: {
          loading: false,
          error: null,
          records: []
        },
        nestedMembers: {
          loading: false,
          error: null,
          records: []
        },
        mappings: {
          loading: false,
          error: null,
          records: []
        },
        nested: {
          loading: false,
          error: null,
          records: []
        }
      }
    );
  });

  it('should handle SAVE_GROUP_REJECTED without error payload', () => {
    expect(
      group(initialState, {
        type: constants.SAVE_GROUP_REJECTED,
        errorMessage: 'ERROR',
        payload: {}
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while saving the group: ERROR',
        record: {},
        groupId: null,
        isNew: false,
        isEdit: false,
        isEditUsers: false,
        isDelete: false,
        requesting: false,
        validationErrors: {},
        addRoles: false,
        members: {
          loading: false,
          error: null,
          records: []
        },
        nestedMembers: {
          loading: false,
          error: null,
          records: []
        },
        mappings: {
          loading: false,
          error: null,
          records: []
        },
        nested: {
          loading: false,
          error: null,
          records: []
        }
      }
    );
  });

  it('should handle SAVE_GROUP_FULFILLED', () => {
    expect(
      group(initialState, {
        type: constants.SAVE_GROUP_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REQUEST_DELETE_GROUP', () => {
    expect(
      group(initialState, {
        type: constants.REQUEST_DELETE_GROUP,
        payload: {
          group: {
            _id: 2,
            name: 'name'
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {
          _id: 2,
          name: 'name'
        },
        groupId: 2,
        isNew: false,
        isEdit: false,
        isEditUsers: false,
        isDelete: true,
        requesting: true,
        validationErrors: {},
        addRoles: false,
        members: {
          loading: false,
          error: null,
          records: []
        },
        nestedMembers: {
          loading: false,
          error: null,
          records: []
        },
        mappings: {
          loading: false,
          error: null,
          records: []
        },
        nested: {
          loading: false,
          error: null,
          records: []
        }
      }
    );
  });

  it('should handle CANCEL_DELETE_GROUP', () => {
    expect(
      group(initialState, {
        type: constants.CANCEL_DELETE_GROUP
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle DELETE_GROUP_PENDING', () => {
    expect(
      group(initialState, {
        type: constants.DELETE_GROUP_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {},
        groupId: null,
        isNew: false,
        isEdit: false,
        isEditUsers: false,
        isDelete: false,
        requesting: false,
        validationErrors: {},
        addRoles: false,
        members: {
          loading: false,
          error: null,
          records: []
        },
        nestedMembers: {
          loading: false,
          error: null,
          records: []
        },
        mappings: {
          loading: false,
          error: null,
          records: []
        },
        nested: {
          loading: false,
          error: null,
          records: []
        }
      }
    );
  });


  it('should handle DELETE_GROUP_REJECTED', () => {
    expect(
      group(initialState, {
        type: constants.DELETE_GROUP_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while deleting the group: ERROR',
        record: {},
        groupId: null,
        isNew: false,
        isEdit: false,
        isEditUsers: false,
        isDelete: false,
        requesting: false,
        validationErrors: {},
        addRoles: false,
        members: {
          loading: false,
          error: null,
          records: []
        },
        nestedMembers: {
          loading: false,
          error: null,
          records: []
        },
        mappings: {
          loading: false,
          error: null,
          records: []
        },
        nested: {
          loading: false,
          error: null,
          records: []
        }
      }
    );
  });

  it('should handle DELETE_GROUP_FULFILLED', () => {
    expect(
      group(initialState, {
        type: constants.DELETE_GROUP_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_GROUP_MEMBERS_PENDING', () => {
    expect(
      group({
        members: {}
      }, {
        type: constants.FETCH_GROUP_MEMBERS_PENDING
      }).toJSON()
    ).toEqual(
      {
        members: {
          error: null,
          loading: true,
          records: []
        }
      }
    );
  });

  it('should handle FETCH_GROUP_MEMBERS_REJECTED', () => {
    expect(
      group({
        members: {}
      }, {
        type: constants.FETCH_GROUP_MEMBERS_REJECTED
      }).toJSON()
    ).toEqual(
      {
        members: {
          error: 'An error occured while loading the members: undefined',
          loading: false,
          records: []
        }
      }
    );
  });


  it('should handle FETCH_GROUP_MEMBERS_FULFILLED', () => {
    expect(
      group({
        members: {}
      }, {
        type: constants.FETCH_GROUP_MEMBERS_FULFILLED,
        payload: {
          data: {
            users: [
              {
                name: 'test'
              }
            ],
            total: 1
          }
        }
      }).toJSON()
    ).toEqual(
      {
        members: {
          loading: false,
          records: [
            {
              last_login_relative: 'a few seconds ago',
              name: 'test'
            }
          ],
          total: 1
        }
      }
    );
  });

  it('should handle GROUP_ADD_ROLES_OPEN', () => {
    expect(
      group({
        addRoles: false
      }, {
        type: constants.GROUP_ADD_ROLES_OPEN
      }).toJSON()
    ).toEqual(
      {
        addRoles: true
      }
    );
  });

  it('should handle GROUP_ADD_ROLES_CLOSE', () => {
    expect(
      group({
        addRoles: true
      }, {
        type: constants.GROUP_ADD_ROLES_CLOSE
      }).toJSON()
    ).toEqual(
      {
        addRoles: false
      }
    );
  });

  it('should handle SAVE_GROUP_ROLES_PENDING', () => {
    expect(
      group({
        addRoles: true,
        loading: false
      }, {
        type: constants.SAVE_GROUP_ROLES_PENDING
      }).toJSON()
    ).toEqual(
      {
        addRoles: true,
        loading: true
      }
    );
  });

  it('should handle SAVE_GROUP_ROLES_REJECTED', () => {
    expect(
      group({
        addRoles: true,
        loading: false
      }, {
        type: constants.SAVE_GROUP_ROLES_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        addRoles: false,
        loading: false,
        error: 'Error during saving roles: ERROR'
      }
    );
  });


  it('should handle SAVE_GROUP_ROLES_FULFILLED', () => {
    expect(
      group({
        addRoles: true,
        loading: false
      }, {
        type: constants.SAVE_GROUP_ROLES_FULFILLED
      }).toJSON()
    ).toEqual(
      {
        addRoles: false,
        loading: false
      }
    );
  });
});
