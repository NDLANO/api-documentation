/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import express, { type Request, type Response } from 'express';
import cors from 'cors';
import path from 'path';
import { absolutePath as swaggerUiAbsolutePath } from 'swagger-ui-dist';

import config from './config';
import { fetchApis } from './api/kongApi';
import {
  apiListTemplate,
  htmlErrorTemplate,
  index,
} from './utils/htmlTemplates';
import { getAppropriateErrorResponse } from './utils/errorHelpers';

const app = express();

const pathToSwaggerUi = swaggerUiAbsolutePath();

// Middleware
app.use(
  cors({
    origin: true, // Consider restricting in future hardening
    credentials: true,
  }),
);
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/swagger-ui-dist', express.static(pathToSwaggerUi));

// Routes
app.get('/swagger', (_req: Request, res: Response) => {
  res.send(index(config.auth0PersonalClientId, false));
});
app.get('/advanced/swagger', (_req: Request, res: Response) => {
  res.send(index(config.auth0PersonalClientId, true));
});

const withTemplate = async (
  swaggerPath: string,
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const routes = await fetchApis();
    const filtered = routes.filter((el) =>
      el.paths.find((apiPath: string) => config.apiDocPath.test(apiPath)),
    );
    res.send(apiListTemplate(swaggerPath, filtered));
  } catch (error: unknown) {
    const response = getAppropriateErrorResponse(
      error as Error & { status?: number; json?: object },
      config.isProduction,
    );
    res.status(response.status).send(htmlErrorTemplate(response));
  }
};

app.get('/', (req: Request, res: Response) => {
  void withTemplate('/', req, res);
});

app.get('/advanced', (req: Request, res: Response) => {
  void withTemplate('/advanced/', req, res);
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 200, text: 'Health check ok' });
});

app.get('/robots.txt', (_: Request, res: Response) => {
  res.type('text/plain');
  res.send('User-agent: *\nAllow: /\n Disallow: /*/');
});

app.get('*', (_req: Request, res: Response) => {
  res.status(404).json({ status: 404, text: 'Not found' });
});

export default app;
