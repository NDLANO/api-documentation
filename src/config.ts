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

const apiDocPath = new RegExp(process.env.API_DOC_PATH_REGEX || 'api-docs');

const config = {
  host: process.env.API_DOCUMENTATION_HOST || '0.0.0.0',
  port: process.env.API_DOCUMENTATION_PORT || '3000',
  ndlaApiGatewayUrl:
    process.env.NDLA_API_URL || 'http://api-gateway.ndla-local:8001',
  apiDocPath,
  whitelist,
  auth0PersonalClientId: process.env.AUTH0_PERSONAL_CLIENT_ID || '',
  app: {
    title: 'NDLA API Documentation',
  },
  ...environment,
};

export default config;
