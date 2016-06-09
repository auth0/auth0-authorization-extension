import ejs from 'ejs';
import config from './config';
import authorizeRule from './rules/authorize';

export default (configuration = { }) =>
  ejs.render(authorizeRule, {
    extensionUrl: config('WT_URL'),
    apiKey: config('AUTHORIZE_API_KEY'),
    config: configuration
  });
