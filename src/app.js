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
import {
  apiListTemplate,
  htmlErrorTemplate,
  index,
} from './utils/htmlTemplates';
import { getAppropriateErrorResponse } from './utils/errorHelpers';

/* eslint arrow-parens: 0 */

const app = express();
const path = require('path');
const pathToSwaggerUi = require('swagger-ui-dist').absolutePath();

app.use(compression());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/swagger-ui-dist', express.static(pathToSwaggerUi));

app.get('/swagger', (req, res) => {
  res.send(index(config.auth0PersonalClientId, false));
  res.end();
});
app.get('/advanced/swagger', (req, res) => {
  res.send(index(config.auth0PersonalClientId, true));
  res.end();
});

const withTemplate = (swaggerPath, req, res) => {
  fetchApis()
    .then((routes) => {
      res.send(
        apiListTemplate(
          swaggerPath,
          routes.filter((el) =>
            el.paths.find((apiPath) => config.apiDocPath.test(apiPath)),
          ),
        ),
      );
      res.end();
    })
    .catch((error) => {
      const response = getAppropriateErrorResponse(error, config.isProduction);
      res.status(response.status).send(htmlErrorTemplate(response));
    });
};

app.get('/', (req, res) => {
  withTemplate('/', req, res);
});

app.get('/advanced', (req, res) => {
  withTemplate('/advanced/', req, res);
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 200, text: 'Health check ok' });
});

app.get('/robots.txt', (_, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nAllow: /\n Disallow: /*/');
});

app.get('*', (req, res) => {
  res.status(404).json({ status: 404, text: 'Not found' });
});

module.exports = app;
