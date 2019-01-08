/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const whitelist = ['article-api', 'audio-api', 'concepts', 'image-api', 'oembed-proxy', 'search-api'];

const environment = {
  development: {
    isProduction: false,
  },
  production: {
    isProduction: true,
  },
}[process.env.NODE_ENV || 'development'];

const getAuth0PersonalClient = () => {
  switch (process.env.NDLA_ENVIRONMENT) {
    case 'prod':
      return 'WU0Kr4CDkrM0uL9xYeFV4cl9Ga1vB3JY';
    case 'staging':
      return 'fvJHyVEVaVTJ9UpoCBZf2O3xKbA7fDeT';
    default:
      return 'FK35FD3YHOeaYcXG80EVCbBmAfiFGziV';
  }
};

module.exports = Object.assign({
  host: process.env.API_DOCUMENTATION_HOST || 'localhost',
  port: process.env.API_DOCUMENTATION_PORT || '3000',
  ndlaApiGatewayUrl: process.env.NDLA_API_URL || 'http://api-gateway.ndla-local:8001',
  apiDocPath: new RegExp('api-docs'),
  whitelist,
  auth0PersonalClient: getAuth0PersonalClient(),
  app: {
    title: 'NDLA API Documentation',
  },

}, environment);
