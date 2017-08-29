import ejs from 'ejs';
import crypto from 'crypto';
import config from './config';
import authorizeRule from './rules/authorize';

const hashApiKey = () => crypto.createHmac('sha256', config('WT_URL'))
    .update(config('EXTENSION_SECRET'))
    .digest('hex');

export default (configuration = { }, userName = '') =>
  ejs.render(authorizeRule, {
    extensionUrl: config('WT_URL').replace(/\/$/g, ''),
    apiKey: hashApiKey(),
    updateTime: () => new Date().toISOString(),
    config: configuration,
    userName
  });
