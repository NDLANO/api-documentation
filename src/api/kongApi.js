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

export async function fetchApis() {
  const routes = await fetchRoutes();

  return routes.data.map((route) => {
    const name = route.paths[0].split('/')[1];
    return { ...route, name };
  });
}

