import ejs from 'ejs';
import config from './config';
import authorizeRule from './rules/authorize';

export default (configuration = { }, userName = '') =>
  ejs.render(authorizeRule, {
    extensionUrl: config('PUBLIC_WT_URL').replace(/\/$/g, ''),
    apiKey: config('EXTENSION_SECRET'),
    updateTime: () => new Date().toISOString(),
    config: configuration,
    userName
  });
