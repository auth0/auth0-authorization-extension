import expect from 'expect';
import { permission } from '../../../client/reducers/permission';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  record: {},
  permissionId: null,
  isNew: false,
  isEdit: false,
  isDelete: false,
  requesting: false,
  validationErrors: {}
};

describe('permission reducer', () => {
  it('should return the initial state', () => {
    expect(
      permission(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_PERMISSION_PENDING', () => {
    expect(
      permission(initialState, {
        type: constants.FETCH_PERMISSION_PENDING,
        meta: {
          permissionId: 1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {},
        permissionId: 1,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle FETCH_PERMISSION_REJECTED', () => {
    expect(
      permission(initialState, {
        type: constants.FETCH_PERMISSION_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the permissions: ERROR',
        record: {},
        permissionId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle FETCH_PERMISSION_FULFILLED', () => {
    expect(
      permission({
        loading: false,
        error: null,
        record: {},
        permissionId: 1,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }, {
        type: constants.FETCH_PERMISSION_FULFILLED,
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
        permissionId: 1,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle FETCH_PERMISSION_FULFILLED', () => {
    expect(
      permission({
        loading: false,
        error: null,
        record: {},
        permissionId: 2,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }, {
        type: constants.FETCH_PERMISSION_FULFILLED,
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
        permissionId: 2,
        record: {},
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle CLEAR_PERMISSION', () => {
    expect(
      permission(initialState, {
        type: constants.CLEAR_PERMISSION
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle CREATE_PERMISSION', () => {
    expect(
      permission(initialState, {
        type: constants.CREATE_PERMISSION
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {},
        permissionId: null,
        isNew: true,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle EDIT_PERMISSION', () => {
    expect(
      permission(initialState, {
        type: constants.EDIT_PERMISSION,
        payload: {
          permission: {
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
        permissionId: 1,
        isNew: false,
        isEdit: true,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle SAVE_PERMISSION_PENDING', () => {
    expect(
      permission(initialState, {
        type: constants.SAVE_PERMISSION_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {},
        permissionId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle SAVE_PERMISSION_REJECTED', () => {
    expect(
      permission(initialState, {
        type: constants.SAVE_PERMISSION_REJECTED,
        errorMessage: 'ERROR',
        payload: {
          data: {
            errors: {
              name: 'test'
            }
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while saving the permission: Validation Error',
        record: {},
        permissionId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {
          name: 'test'
        }
      }
    );
  });

  it('should handle SAVE_PERMISSION_REJECTED', () => {
    expect(
      permission(initialState, {
        type: constants.SAVE_PERMISSION_REJECTED,
        errorMessage: 'ERROR',
        payload: {
          data: {}
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while saving the permission: ERROR',
        record: {},
        permissionId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle SAVE_PERMISSION_FULFILLED', () => {
    expect(
      permission(initialState, {
        type: constants.SAVE_PERMISSION_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REQUEST_DELETE_PERMISSION', () => {
    expect(
      permission(initialState, {
        type: constants.REQUEST_DELETE_PERMISSION,
        payload: {
          permission: {
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
        permissionId: 1,
        isNew: false,
        isEdit: false,
        isDelete: true,
        requesting: true,
        validationErrors: {}
      }
    );
  });

  it('should handle CANCEL_DELETE_PERMISSION', () => {
    expect(
      permission(initialState, {
        type: constants.CANCEL_DELETE_PERMISSION
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle DELETE_PERMISSION_PENDING', () => {
    expect(
      permission(initialState, {
        type: constants.DELETE_PERMISSION_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {},
        permissionId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle DELETE_PERMISSION_REJECTED', () => {
    expect(
      permission(initialState, {
        type: constants.DELETE_PERMISSION_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while deleting the permission: ERROR',
        record: {},
        permissionId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle DELETE_PERMISSION_FULFILLED', () => {
    expect(
      permission(initialState, {
        type: constants.DELETE_PERMISSION_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
