import ejs from 'ejs';
import crypto from 'crypto';
import config from './config';
import authorizeRule from './rules/authorize';
import restrictAccess from './rules/restrictAccess';


const hashApiKey = () => crypto.createHmac('sha256', config('PUBLIC_WT_URL'))
    .update(config('EXTENSION_SECRET'))
    .digest('hex');

export default (configuration = { }, userName = '') =>
  ejs.render(authorizeRule, {
    extensionUrl: config('PUBLIC_WT_URL').replace(/\/$/g, ''),
    apiKey: hashApiKey(),
    updateTime: () => new Date().toISOString(),
    config: configuration,
    userName
  });

module.exports.compileAuthorizeRule = (configuration = { }, userName = '') =>
  ejs.render(authorizeRule, {
    extensionUrl: config('PUBLIC_WT_URL').replace(/\/$/g, ''),
    apiKey: hashApiKey(),
    updateTime: () => new Date().toISOString(),
    config: configuration,
    userName
  });

module.exports.compileRestrictAccessRule = (userName = '') => 
  ejs.render(restrictAccess, {
    updateTime: () => new Date().toISOString(),
    userName
  });