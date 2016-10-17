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
        type: constants.FETCH_GROUP_PENDING
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
        _id: 2,
        name: 'test'
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
        isEdit: false,
        isEditUsers: true,
        isDelete: false,
        requesting: false,
        validationErrors: {},
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
            errors: 'error'
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while saving the group: error',
        record: {},
        groupId: null,
        isNew: false,
        isEdit: false,
        isEditUsers: false,
        isDelete: false,
        requesting: false,
        validationErrors: 'error',
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
        type: constants.SAVE_GROUP_REJECTED
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
        errorMessage: 'ERROR'
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
        requesting: false,
        validationErrors: {},
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
        members: {}
      }
    );
  });
});
