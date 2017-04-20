import { setProvider } from '../server/lib/config';

export const setConfig = (settings) => {
  setProvider((key) => settings[key]);
};
