import expect from 'expect';
import { groupPicker } from '../../../client/reducers/groupPicker';
import * as constants from '../../../client/constants';

const initialState = {
  error: null,
  loading: false,
  open: false,
  records: [],
  title: 'Select a group.'
};

describe('groupPicker reducer', () => {
  it('should return the initial state', () => {
    expect(
      groupPicker(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle OPEN_GROUP_PICKER', () => {
    expect(
      groupPicker(initialState, {
        type: constants.OPEN_GROUP_PICKER,
        payload: {
          title: 'test'
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        open: true,
        records: [],
        title: 'test'
      }
    );
  });

  it('should handle LOAD_GROUP_PICKER_PENDING', () => {
    expect(
      groupPicker(initialState, {
        type: constants.LOAD_GROUP_PICKER_PENDING
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: true,
        open: false,
        records: [],
        title: 'Select a group.'
      }
    );
  });

  it('should handle LOAD_GROUP_PICKER_REJECTED', () => {
    expect(
      groupPicker(initialState, {
        type: constants.LOAD_GROUP_PICKER_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        error: 'An error occured while loading the groups: ERROR',
        loading: false,
        open: false,
        records: [],
        title: 'Select a group.'
      }
    );
  });

  it('should handle LOAD_GROUP_PICKER_FULFILLED', () => {
    expect(
      groupPicker(initialState, {
        type: constants.LOAD_GROUP_PICKER_FULFILLED,
        payload: {
          data: {
            groups: [ { id: 1 }, { id: 2 } ],
            total: 2
          }
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        open: false,
        records: [ { id: 1 }, { id: 2 } ],
        title: 'Select a group.'
      }
    );
  });

  it('should handle CANCEL_GROUP_PICKER', () => {
    expect(
      groupPicker(initialState, {
        type: constants.CANCEL_GROUP_PICKER
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle CANCEL_GROUP_PICKER', () => {
    expect(
      groupPicker(initialState, {
        type: constants.CANCEL_GROUP_PICKER
      }).toJSON()
    ).toEqual(
        initialState
    );
  });

  it('should handle CONFIRM_GROUP_PICKER', () => {
    expect(
      groupPicker(initialState, {
        type: constants.CONFIRM_GROUP_PICKER
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: true,
        open: false,
        records: [],
        title: 'Select a group.'
      }
    );
  });
});
