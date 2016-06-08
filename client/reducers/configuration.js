import { fromJS } from 'immutable';
import _ from 'lodash';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading : false,
  error: null,
  record: { }
};

export const configuration = createReducer(fromJS(initialState), {

});
