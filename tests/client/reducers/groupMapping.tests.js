import expect from 'expect';
import { groupMapping } from '../../../client/reducers/groupMapping';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  record: {},
  groupMappingId: null,
  isNew: false,
  isEdit: false,
  isDelete: false,
  requesting: false,
  validationErrors: {}
};

describe('groupMapping reducer', () => {
  it('should return the initial state', () => {
    expect(
      groupMapping(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle CLEAR_GROUP_MAPPING', () => {
    expect(
      groupMapping(initialState, {
        type: constants.CLEAR_GROUP_MAPPING
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle CREATE_GROUP_MAPPING', () => {
    expect(
      groupMapping(initialState, {
        type: constants.CREATE_GROUP_MAPPING
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {},
        groupMappingId: null,
        isNew: true,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle EDIT_GROUP_MAPPING', () => {
    expect(
      groupMapping(initialState, {
        type: constants.EDIT_GROUP_MAPPING,
        payload: {
          groupMapping: {
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
        groupMappingId: 1,
        isNew: false,
        isEdit: true,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle SAVE_GROUP_MAPPING_PENDING', () => {
    expect(
      groupMapping(initialState, {
        type: constants.SAVE_GROUP_MAPPING_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {},
        groupMappingId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle SAVE_GROUP_MAPPING_REJECTED', () => {
    expect(
      groupMapping(initialState, {
        type: constants.SAVE_GROUP_MAPPING_REJECTED,
        payload: {
          data: {
            errors: { field_1: 'test' }
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while saving the mapping: Validation Error',
        record: {},
        groupMappingId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: { field_1: 'test' }
      }
    );
  });

  it('should handle SAVE_GROUP_MAPPING_REJECTED', () => {
    expect(
      groupMapping(initialState, {
        type: constants.SAVE_GROUP_MAPPING_REJECTED,
        errorMessage: 'ERROR',
        payload: {}
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while saving the mapping: ERROR',
        record: {},
        groupMappingId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle SAVE_GROUP_MAPPING_REJECTED', () => {
    expect(
      groupMapping(initialState, {
        type: constants.SAVE_GROUP_MAPPING_REJECTED,
        payload: {}
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while saving the mapping: Validation Error',
        record: {},
        groupMappingId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle SAVE_GROUP_MAPPING_FULFILLED', () => {
    expect(
      groupMapping(initialState, {
        type: constants.SAVE_GROUP_MAPPING_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REQUEST_DELETE_GROUP_MAPPING', () => {
    expect(
      groupMapping(initialState, {
        type: constants.REQUEST_DELETE_GROUP_MAPPING,
        payload: {
          groupMapping: {
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
        groupMappingId: 1,
        isNew: false,
        isEdit: false,
        isDelete: true,
        requesting: true,
        validationErrors: {}
      }
    );
  });

  it('should handle CANCEL_DELETE_GROUP_MAPPING', () => {
    expect(
      groupMapping(initialState, {
        type: constants.CANCEL_DELETE_GROUP_MAPPING
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle DELETE_GROUP_MAPPING_PENDING', () => {
    expect(
      groupMapping(initialState, {
        type: constants.DELETE_GROUP_MAPPING_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {},
        groupMappingId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });

  it('should handle DELETE_GROUP_MAPPING_REJECTED', () => {
    expect(
      groupMapping(initialState, {
        type: constants.DELETE_GROUP_MAPPING_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while deleting the mapping: ERROR',
        record: {},
        groupMappingId: null,
        isNew: false,
        isEdit: false,
        isDelete: false,
        requesting: false,
        validationErrors: {}
      }
    );
  });


  it('should handle DELETE_GROUP_MAPPING_FULFILLED', () => {
    expect(
      groupMapping(initialState, {
        type: constants.DELETE_GROUP_MAPPING_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
