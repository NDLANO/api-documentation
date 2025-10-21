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
import { promisify } from 'util';
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
  res.send(index(config.auth0PersonalClientId, false));
});
app.get('/advanced/swagger', (_req: Request, res: Response) => {
  res.send(index(config.auth0PersonalClientId, true));
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

const parseTestApiRoutesForDevelopment = async (): Promise<ApiRoute[]> => {
  // NOTE: For local development, with no routes configured, we can call kubectl to get some test routes
  //       This requires that kubectl is installed and configured with access to the test cluster
  const { exec: execCallback } = await import('node:child_process');
  const exec = promisify(execCallback);
  const kubectlCommand =
    'kubectl --context test get configmap api-docs-openapi-endpoints -o json';
  console.log(
    `Running kubectl command to get test API routes: '${kubectlCommand}'`,
  );
  const configMapJson = await exec(kubectlCommand);

  const configMap = JSON.parse(configMapJson.stdout);
  const endpointsData = configMap?.data?.OPENAPI_ENDPOINTS;
  const endpointsDataParsed = JSON.parse(endpointsData);

  if (
    Array.isArray(endpointsDataParsed) &&
    endpointsDataParsed.every(jsonIsApiRoute) &&
    endpointsDataParsed.length > 0
  ) {
    console.log(
      `Found ${endpointsDataParsed.length} test API routes from kubectl`,
    );
    return endpointsDataParsed;
  }

  throw new Error('No valid test API routes found from kubectl');
};

let generatedRoutes: ApiRoute[] | null = null;

const generateApiDocsRoutes = async (): Promise<ApiRoute[]> => {
  const parsed = JSON.parse(config.endpoints_json);
  if (Array.isArray(parsed) && parsed.every(jsonIsApiRoute)) {
    if (parsed.length > 0) return parsed;

    if (parsed.length === 0 && !config.isProduction) {
      return parseTestApiRoutesForDevelopment();
    }
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

app.use((_req: Request, res: Response) => {
  res.status(404).json({ status: 404, text: 'Not found' });
});

export default app;
