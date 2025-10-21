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
import {
  apiListTemplate,
  ApiRoute,
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
  res.send(index(config.auth0PersonalClientId));
});
app.get('/advanced/swagger', (req: Request, res: Response) => {
  const query = new URLSearchParams(
    req.query as Record<string, string>,
  ).toString();
  const redirectUrl = query ? `/swagger?${query}` : '/swagger';
  res.redirect(redirectUrl);
});

const jsonIsApiRoute = (obj: unknown): obj is ApiRoute => {
  if (
    obj &&
    typeof obj === 'object' &&
    'name' in obj &&
    'paths' in obj &&
    typeof obj.name === 'string' &&
    Array.isArray(obj.paths)
  ) {
    return true;
  }
  return false;
};

let generatedRoutes: ApiRoute[] | null = null;

const generateApiDocsRoutes = async (): Promise<ApiRoute[]> => {
  const parsed = JSON.parse(config.endpoints_json);
  if (Array.isArray(parsed) && parsed.every(jsonIsApiRoute)) {
    if (parsed.length > 0) return parsed;
  }

  throw new Error('No valid API routes found');
};

const withTemplate = async (
  swaggerPath: string,
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!generatedRoutes) {
      generatedRoutes = await generateApiDocsRoutes();
    }
    res.send(apiListTemplate(swaggerPath, generatedRoutes));
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

app.get('/advanced', (_req: Request, res: Response) => {
  void res.redirect('/');
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 200, text: 'Health check ok' });
});

app.get('/robots.txt', (_: Request, res: Response) => {
  res.type('text/plain');
  res.send('User-agent: *\nAllow: /\n Disallow: /*/');
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ status: 404, text: 'Not found' });
});

export default app;
