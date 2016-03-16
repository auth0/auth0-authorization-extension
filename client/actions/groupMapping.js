import axios from 'axios';
import * as constants from '../constants';

export function createGroupMapping() {
  return {
    type: constants.CREATE_GROUP_MAPPING
  };
}

export function editGroupMapping(groupMapping) {
  return {
    type: constants.EDIT_GROUP_MAPPING,
    payload: {
      groupMapping
    }
  };
}

export function saveGroupMapping(group, groupMapping) {
  return (dispatch, getState) => {
    const state = getState().groupMapping.toJS();
    dispatch({
      type: constants.SAVE_GROUP_MAPPING,
      payload: {
        promise: axios({
          method: state.isNew ? 'post' : 'put',
          url: state.isNew ? `/api/groups/${group._id}/mappings` : `/api/groups/${group._id}/mappings/${groupMapping._id}`,
          data: groupMapping,
          timeout: 5000,
          responseType: 'json'
        })
      },
      meta: {
        isNew: state.isNew,
        groupMapping,
        groupMappingId: state.groupMappingId || groupMapping._id
      }
    });
  };
}

export function requestDeleteGroupMapping(groupMapping) {
  return {
    type: constants.REQUEST_DELETE_GROUP_MAPPING,
    payload: {
      groupMapping
    }
  };
}

export function cancelDeleteGroupMapping() {
  return {
    type: constants.CANCEL_DELETE_GROUP_MAPPING
  };
}

export function deleteGroupMapping(group) {
  return (dispatch, getState) => {
    const groupMappingId = getState().groupMapping.get('groupMappingId');
    dispatch({
      type: constants.DELETE_GROUP_MAPPING,
      payload: {
        promise: axios.delete(`/api/groups/${group._id}/mappings/${groupMapping._id}`, {
          timeout: 5000,
          responseType: 'json'
        })
      },
      meta: {
        groupMappingId
      }
    });
  };
}

export function clearGroupMapping() {
  return {
    type: constants.CLEAR_GROUP_MAPPING
  };
}
