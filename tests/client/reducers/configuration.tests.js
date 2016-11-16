import expect from 'expect';
import { configuration } from '../../../client/reducers/configuration';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  record: {},
  resourceserver: { },
  activeTab: 1
};

describe('configuration reducer', () => {
  it('should return the initial state', () => {
    expect(
      configuration(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_CONFIGURATION_PENDING', () => {
    expect(
      configuration(initialState, {
        type: constants.FETCH_CONFIGURATION_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {},
        resourceserver: { },
        activeTab: 1
      }
    );
  });

  it('should handle FETCH_CONFIGURATION_REJECTED', () => {
    expect(
      configuration(initialState, {
        type: constants.FETCH_CONFIGURATION_REJECTED,
        errorMessage: 'ERROR',
        payload: {}
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the configuration: ERROR',
        record: {},
        resourceserver: { },
        activeTab: 1
      }
    );
  });

  it('should handle FETCH_CONFIGURATION_FULFILLED', () => {
    expect(
      configuration(initialState, {
        type: constants.FETCH_CONFIGURATION_FULFILLED,
        payload: {
          data: {
            id: 'con_test123',
            name: 'my-custom-db'
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {
          id: 'con_test123',
          name: 'my-custom-db'
        },
        resourceserver: { },
        activeTab: 1
      }
    );
  });

  it('should handle SAVE_CONFIGURATION_PENDING', () => {
    expect(
      configuration(initialState, {
        type: constants.SAVE_CONFIGURATION_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {},
        resourceserver: { },
        activeTab: 1
      }
    );
  });

  it('should handle SAVE_CONFIGURATION_REJECTED', () => {
    expect(
      configuration(initialState, {
        type: constants.SAVE_CONFIGURATION_REJECTED,
        errorMessage: 'ERROR',
        payload: {}
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while saving the configuration: ERROR',
        record: {},
        resourceserver: { },
        activeTab: 1
      }
    );
  });

  it('should handle SAVE_CONFIGURATION_REJECTED', () => {
    expect(
      configuration(initialState, {
        type: constants.SAVE_CONFIGURATION_REJECTED,
        payload: {}
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while saving the configuration: Validation Error',
        record: {},
        resourceserver: { },
        activeTab: 1
      }
    );
  });

  it('should handle SAVE_CONFIGURATION_REJECTED', () => {
    expect(
      configuration(initialState, {
        type: constants.SAVE_CONFIGURATION_REJECTED,
        payload: {
          data: {
            errors: 'FORBIDDEN'
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while saving the configuration: FORBIDDEN',
        record: {},
        resourceserver: { },
        activeTab: 1
      }
    );
  });

  it('should handle SAVE_CONFIGURATION_FULFILLED', () => {
    expect(
      configuration(initialState, {
        type: constants.SAVE_CONFIGURATION_FULFILLED,
        payload: {
          data: [
            {
              id: 'con_test123',
              name: 'my-custom-db'
            },
            {
              id: 'con_test1234',
              name: 'my-custom-db_2'
            }
          ]
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: [
          {
            id: 'con_test123',
            name: 'my-custom-db'
          },
          {
            id: 'con_test1234',
            name: 'my-custom-db_2'
          }
        ],
        resourceserver: { },
        activeTab: 1
      }
    );
  });

  it('should handle FETCH_CONFIGURATION_RESOURCESERVER_PENDING', () => {
    expect(
      configuration(initialState, {
        type: constants.FETCH_CONFIGURATION_RESOURCESERVER_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {},
        resourceserver: { },
        activeTab: 1
      }
    );
  });

  it('should handle FETCH_CONFIGURATION_RESOURCESERVER_REJECTED', () => {
    expect(
      configuration(initialState, {
        type: constants.FETCH_CONFIGURATION_RESOURCESERVER_REJECTED,
        errorMessage: 'ERROR',
        payload: {}
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the resource server configuration: ERROR',
        record: {},
        resourceserver: { },
        activeTab: 1
      }
    );
  });

  it('should handle FETCH_CONFIGURATION_RESOURCESERVER_FULFILLED', () => {
    expect(
      configuration(initialState, {
        type: constants.FETCH_CONFIGURATION_RESOURCESERVER_FULFILLED,
        payload: {
          data: {
            id: 'con_test123',
            name: 'my-custom-db'
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {},
        resourceserver: {
          id: 'con_test123',
          name: 'my-custom-db'
        },
        activeTab: 1
      }
    );
  });

  it('should handle SAVE_CONFIGURATION_RESOURCESERVER_PENDING', () => {
    expect(
      configuration(initialState, {
        type: constants.SAVE_CONFIGURATION_RESOURCESERVER_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {},
        resourceserver: { },
        activeTab: 1
      }
    );
  });

  it('should handle SAVE_CONFIGURATION_RESOURCESERVER_REJECTED', () => {
    expect(
      configuration(initialState, {
        type: constants.SAVE_CONFIGURATION_RESOURCESERVER_REJECTED,
        errorMessage: 'ERROR',
        payload: {}
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while saving the resource server configuration: ERROR',
        record: {},
        resourceserver: { },
        activeTab: 1
      }
    );
  });

  it('should handle SAVE_CONFIGURATION_RESOURCESERVER_FULFILLED', () => {
    expect(
      configuration(initialState, {
        type: constants.SAVE_CONFIGURATION_RESOURCESERVER_FULFILLED,
        payload: {
          data: {
            apiAccess: true,
            token_lifetime: 10
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: { },
        resourceserver: { },
        activeTab: 1
      }
    );
  });

  it('should handle SET_CONFIGURATION_TAB', () => {
    expect(
      configuration(initialState, {
        type: constants.SET_CONFIGURATION_TAB,
        meta: {
          activeTab: 2
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {},
        resourceserver: { },
        activeTab: 2
      }
    );
  });
});
