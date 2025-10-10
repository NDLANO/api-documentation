/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  apiResourceUrl,
  resolveJsonOrRejectWithError,
} from '../utils/apiHelpers';
import { Agent } from 'undici';

type KongRoute = {
  id?: string;
  paths: string[];
  [key: string]: unknown;
};

type KongRoutesPage = {
  data: KongRoute[];
  next?: string | null;
  [key: string]: unknown;
};

const insecureAgent = new Agent({
  // Always disable TLS verification for Kong API (cluster uses self-signed cert)
  connect: { rejectUnauthorized: false },
});

async function fetchRoutesPage(url: string): Promise<KongRoutesPage> {
  const res = await fetch(url, { dispatcher: insecureAgent } as any);
  return resolveJsonOrRejectWithError(res) as Promise<KongRoutesPage>;
}

async function fetchAllRoutes(): Promise<KongRoute[]> {
  let url: string | undefined | null = apiResourceUrl('/routes');
  const all: KongRoute[] = [];
  const seen = new Set<string>();

  while (url) {
    const page = await fetchRoutesPage(url);
    for (const route of page.data) {
      // Avoid duplicates if Kong returns overlapping pages
      const key = route.id || JSON.stringify(route.paths);
      if (!seen.has(key)) {
        seen.add(key);
        all.push(route);
      }
    }
    url = page.next ?? '';
  }

  return all;
}

/**
 * Fetch all APIs (routes) and enrich with a derived 'name'
 * (first path segment after the leading slash).
 */
export async function fetchApis(): Promise<(KongRoute & { name: string })[]> {
  const routes = await fetchAllRoutes();
  return routes.map((route) => {
    const firstPath = route.paths?.[0] || '';
    const name = firstPath.split('/')[1] || 'unknown';
    return { ...route, name };
  });
}
