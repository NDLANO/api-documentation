/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const whitelist = (
  process.env.WHITELIST ||
  'article-api,audio-api,concept-api,image-api,learningpath-api,oembed-proxy,search-api'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const environment = (() => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return { isProduction: true };
    default:
      return { isProduction: false };
  }
})();

const apiDomain = (() => {
  const ndlaEnv = process.env.NDLA_ENVIRONMENT || 'dev';
  switch (ndlaEnv) {
    case 'prod':
      return 'https://api.ndla.no';
    case 'dev':
      return 'https://api.test.ndla.no';
    default:
      return `https://api.${ndlaEnv}.ndla.no`;
  }
})();

const config = {
  host: process.env.API_DOCUMENTATION_HOST || '0.0.0.0',
  port: process.env.API_DOCUMENTATION_PORT || '3000',
  endpoints_json: process.env.OPENAPI_ENDPOINTS || '[]',
  whitelist,
  auth0PersonalClientId: process.env.AUTH0_PERSONAL_CLIENT_ID || '',
  app: {
    title: 'NDLA API Documentation',
  },
  ...environment,
  apiDomain,
};

export default config;
