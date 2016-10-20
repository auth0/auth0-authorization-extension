import expect from 'expect';
import { userPicker } from '../../../client/reducers/userPicker';
import * as constants from '../../../client/constants';

const initialState = {
  error: null,
  loading: false,
  open: false,
  total: 0,
  records: [],
  selection: [],
  title: 'Select one or more users.'
};

describe('userPicker reducer', () => {
  it('should return the initial state', () => {
    expect(
      userPicker(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle OPEN_USER_PICKER', () => {
    expect(
      userPicker(initialState, {
        type: constants.OPEN_USER_PICKER,
        payload: {
          title: 'title'
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        open: true,
        total: 0,
        records: [],
        selection: [],
        title: 'title'
      }
    );
  });

  it('should handle SEARCH_USER_PICKER_PENDING', () => {
    expect(
      userPicker(initialState, {
        type: constants.SEARCH_USER_PICKER_PENDING,
        meta: {
          page: 0
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: true,
        open: false,
        total: 0,
        records: [],
        selection: [],
        title: 'Select one or more users.'
      }
    );
  });

  it('should handle SEARCH_USER_PICKER_PENDING', () => {
    expect(
      userPicker({
        error: null,
        loading: false,
        open: false,
        total: 0,
        records: [1],
        selection: [],
        title: 'Select one or more users.'
      }, {
        type: constants.SEARCH_USER_PICKER_PENDING,
        meta: {
          page: 1
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: true,
        open: false,
        total: 0,
        records: [1],
        selection: [],
        title: 'Select one or more users.'
      }
    );
  });

  it('should handle SEARCH_USER_PICKER_REJECTED', () => {
    expect(
      userPicker(initialState, {
        type: constants.SEARCH_USER_PICKER_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        error: 'An error occured while loading the users: ERROR',
        loading: false,
        open: false,
        total: 0,
        records: [],
        selection: [],
        title: 'Select one or more users.'
      }
    );
  });

  it('should handle SEARCH_USER_PICKER_FULFILLED', () => {
    expect(
      userPicker(initialState, {
        type: constants.SEARCH_USER_PICKER_FULFILLED,
        payload: {
          data: {
            total: 100,
            users: []
          },
        },
        meta: {
          page: 1
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        open: false,
        total: 100,
        nextPage: 2,
        records: [],
        selection: [],
        title: 'Select one or more users.'
      }
    );
  });


  it('should handle CANCEL_USER_PICKER', () => {
    expect(
      userPicker(initialState, {
        type: constants.CANCEL_USER_PICKER
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle CONFIRM_USER_PICKER', () => {
    expect(
      userPicker(initialState, {
        type: constants.CONFIRM_USER_PICKER
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: true,
        open: false,
        total: 0,
        records: [],
        selection: [],
        title: 'Select one or more users.'
      }
    );
  });

  it('should handle SELECT_USER', () => {
    expect(
      userPicker(initialState, {
        type: constants.SELECT_USER,
        payload: {
          user: {
            user_id: 1
          }
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        open: false,
        total: 0,
        records: [],
        selection: [1],
        title: 'Select one or more users.'
      }
    );
  });

  it('should handle SELECT_USER', () => {
    expect(
      userPicker({
        error: null,
        loading: false,
        open: false,
        total: 0,
        records: [],
        selection: [{ user_id: 2, name: 'test' }, { user_id: 1, name: 'test_1' }],
        title: 'Select one or more users.'
      }, {
        type: constants.SELECT_USER,
        payload: {
          user: {
            user_id: 1
          }
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        open: false,
        total: 0,
        records: [],
        selection: [
          1, { user_id: 2, name: 'test' }, { user_id: 1, name: 'test_1' }
        ],
        title: 'Select one or more users.'
      }
    );
  });

  it('should handle UNSELECT_USER', () => {
    expect(
      userPicker(initialState, {
        type: constants.UNSELECT_USER
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        open: false,
        total: 0,
        records: [],
        selection: [],
        title: 'Select one or more users.'
      }
    );
  });

});
