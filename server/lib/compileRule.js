import ejs from 'ejs';
import config from './config';
import authorizeRule from './rules/authorize';

export default (configuration = { }, userName = '') =>
  ejs.render(authorizeRule, {
    extensionUrl: config('WT_URL'),
    apiKey: config('AUTHORIZE_API_KEY'),
    updateTime: () => new Date().toISOString(),
    config: configuration,
    userName
  });
