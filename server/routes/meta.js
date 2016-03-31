import express from 'express';
import metadata from '../../webtask.json';

export default () => {
  const api = express.Router();
  api.get('/', (req, res) => {
    res.status(200).send(metadata);
  });

  return api;
};
