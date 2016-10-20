import expect from 'expect';
import { importExport } from '../../../client/reducers/importExport';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  record: {}
};

describe('importExport reducer', () => {
  it('should return the initial state', () => {
    expect(
      importExport(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_CONFIGURATION_EXPORT_PENDING', () => {
    expect(
      importExport(initialState, {
        type: constants.FETCH_CONFIGURATION_EXPORT_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {}
      }
    );
  });

  it('should handle FETCH_CONFIGURATION_EXPORT_REJECTED', () => {
    expect(
      importExport(initialState, {
        type: constants.FETCH_CONFIGURATION_EXPORT_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the config: ERROR',
        record: {}
      }
    );
  });

  it('should handle FETCH_CONFIGURATION_EXPORT_FULFILLED', () => {
    expect(
      importExport(initialState, {
        type: constants.FETCH_CONFIGURATION_EXPORT_FULFILLED,
        payload: {
          data: {
            name: 'auth0-github-deploy',
            global: false,
            client_id: 'z4JBexbssw4o6mCRPRQWaxzqampwXULL'
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {
          name: 'auth0-github-deploy',
          global: false,
          client_id: 'z4JBexbssw4o6mCRPRQWaxzqampwXULL'
        }
      }
    );
  });

  it('should handle FETCH_CONFIGURATION_IMPORT_PENDING', () => {
    expect(
      importExport(initialState, {
        type: constants.FETCH_CONFIGURATION_IMPORT_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {}
      }
    );
  });

  it('should handle FETCH_CONFIGURATION_IMPORT_REJECTED', () => {
    expect(
      importExport(initialState, {
        type: constants.FETCH_CONFIGURATION_IMPORT_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while updating the config: ERROR',
        record: {}
      }
    );
  });

  it('should handle FETCH_CONFIGURATION_IMPORT_FULFILLED', () => {
    expect(
      importExport(initialState, {
        type: constants.FETCH_CONFIGURATION_IMPORT_FULFILLED,
        meta: {
          config: {
            name: 'auth0-github-deploy',
            global: false,
            client_id: 'z4JBexbssw4o6mCRPRQWaxzqampwXULL'
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {
          name: 'auth0-github-deploy',
          global: false,
          client_id: 'z4JBexbssw4o6mCRPRQWaxzqampwXULL'
        }
      }
    );
  });

  it('should handle FETCH_CONFIGURATION_ADD_ERROR', () => {
    expect(
      importExport(initialState, {
        type: constants.FETCH_CONFIGURATION_ADD_ERROR,
        meta: {
          error: 'ERROR'
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'ERROR',
        record: {}
      }
    );
  });

  it('should handle FETCH_CONFIGURATION_CLOSE_ERROR', () => {
    expect(
      importExport(initialState, {
        type: constants.FETCH_CONFIGURATION_CLOSE_ERROR
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
