/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { apiResourceUrl, resolveJsonOrRejectWithError } from '../utils/apiHelpers';

function fetchRoutes(method = 'GET') {
  const url = apiResourceUrl('/routes');
  return fetch(url, { method }).then(resolveJsonOrRejectWithError);
}

function fetchServices(method = 'GET') {
  const url = apiResourceUrl('/services')
  return fetch(url, { method }).then(resolveJsonOrRejectWithError);
}

export async function fetchApis(method = 'GET') {
  const [routes, services] = await Promise.all([fetchRoutes(), fetchServices()]);
  routes.data.forEach((route) => {
    services.data.forEach((service) => {
    if(service.id == route.service.id) {
    try {
      route.service.name = service.name;
    } catch (e) {
      console.log(e)
    }
  }
});
});
  return routes;
}

