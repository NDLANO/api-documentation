/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'isomorphic-fetch';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import config from './config';
import { fetchApis } from './api/kongApi';
import { apiList, htmlErrorTemplate } from './utils/htmlTemplates';

const app = express();
const path = require('path');
app.use(compression());
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use('/swagger', express.static(path.join(__dirname, 'public')))
app.use('/swagger-ui', express.static(path.join(__dirname, '../node_modules/swagger-ui/dist')))

async function fetchAndTransformApis() {
  const article = await fetchApis();
  return { ...article };
}

app.get('/', (req, res) => {
  const lang = 'nb';
  fetchAndTransformApis()
    .then((article) => {
      res.send(apiList(lang, article));
      res.end();
    }).catch((error) => {
    const response = getAppropriateErrorResponse(error, config.isProduction);
    res.status(response.status).send(htmlErrorTemplate(lang, response));
  });
});


app.get('*', (req, res) => {
  res.status(404).json({ status: 404, text: 'Not found' });
});

module.exports = app;
