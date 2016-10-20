import expect from 'expect';
import { role } from '../../../client/reducers/role';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  record: {},
  roleId: null,
  isNew: false,
  isEdit: false,
  isDelete: false,
  requesting: false,
  validationErrors: {}
};

describe('role reducer', () => {
  it('should return the initial state', () => {
    expect(
      role(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_ROLE_PENDING', () => {
    expect(
      role(initialState, {
        type: constants.FETCH_ROLE_PENDING,
        meta: {
          roleId: 1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {},
        roleId: 1,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle FETCH_ROLE_REJECTED', () => {
    expect(
      role(initialState, {
        type: constants.FETCH_ROLE_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the roles: ERROR',
        record: {},
        roleId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle FETCH_ROLE_FULFILLED', () => {
    expect(
      role(initialState, {
        type: constants.FETCH_ROLE_FULFILLED,
        payload: {
          data: {
            _id: 1,
            name: 'test'
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {},
        roleId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });
  it('should handle FETCH_ROLE_FULFILLED', () => {
    expect(
      role({
        loading: false,
        error: null,
        record: {},
        roleId: 1,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }, {
        type: constants.FETCH_ROLE_FULFILLED,
        payload: {
          data: {
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
        roleId: 1,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });


  it('should handle CLEAR_ROLE', () => {
    expect(
      role(initialState, {
        type: constants.CLEAR_ROLE
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle CREATE_ROLE', () => {
    expect(
      role(initialState, {
        type: constants.CREATE_ROLE
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {},
        roleId: null,
        isNew: true,
        page: 'chooseApplication',
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });


  it('should handle ROLE_APPLICATION_SELECTED', () => {
    expect(
      role(initialState, {
        type: constants.ROLE_APPLICATION_SELECTED,
        payload: {
          applicationId: [1, 2]
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {
          applicationId: [1, 2]
        },
        page: 'editRole',
        roleId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });
  it('should handle ROLE_APPLICATION_SELECTED', () => {
    expect(
      role(initialState, {
        type: constants.ROLE_APPLICATION_SELECTED,
        payload: {
          applicationId: null
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {
          applicationId: null
        },
        page: 'chooseApplication',
        roleId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle EDIT_ROLE', () => {
    expect(
      role(initialState, {
        type: constants.EDIT_ROLE,
        payload: {
          role: {
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
        page: 'editRole',
        roleId: 1,
        isNew: false,
        isEdit: true,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle SAVE_ROLE_PENDING', () => {
    expect(
      role(initialState, {
        type: constants.SAVE_ROLE_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {},
        roleId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle SAVE_ROLE_REJECTED', () => {
    expect(
      role(initialState, {
        type: constants.SAVE_ROLE_REJECTED,
        payload: {
          data: {
            errors: {}
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while saving the role: Validation Error',
        record: {},
        roleId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });
  it('should handle SAVE_ROLE_REJECTED', () => {
    expect(
      role(initialState, {
        type: constants.SAVE_ROLE_REJECTED,
        payload: {}
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while saving the role: Validation Error',
        record: {},
        roleId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });
  it('should handle SAVE_ROLE_REJECTED', () => {
    expect(
      role(initialState, {
        type: constants.SAVE_ROLE_REJECTED,
        payload: {},
        errorMessage: 'Error'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while saving the role: Error',
        record: {},
        roleId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle SAVE_ROLE_FULFILLED', () => {
    expect(
      role(initialState, {
        type: constants.SAVE_ROLE_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REQUEST_DELETE_ROLE', () => {
    expect(
      role(initialState, {
        type: constants.REQUEST_DELETE_ROLE,
        payload: {
          role: {
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
        roleId: 1,
        isNew: false,
        isEdit: false,
        isDelete: true,
        requesting: true,
        validationErrors: {}
      }
    );
  });

  it('should handle CANCEL_DELETE_ROLE', () => {
    expect(
      role(initialState, {
        type: constants.CANCEL_DELETE_ROLE
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle DELETE_ROLE_PENDING', () => {
    expect(
      role(initialState, {
        type: constants.DELETE_ROLE_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {},
        roleId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle DELETE_ROLE_REJECTED', () => {
    expect(
      role(initialState, {
        type: constants.DELETE_ROLE_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while deleting the role: ERROR',
        record: {},
        roleId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle DELETE_ROLE_FULFILLED', () => {
    expect(
      role(initialState, {
        type: constants.DELETE_ROLE_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
