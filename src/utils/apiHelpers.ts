/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from '../config';
import { createErrorPayload } from './errorHelpers';
import log from './logger';

/**
 * Base URL for NDLA API Gateway.
 * In unittest mode we point to a stable internal name.
 */
export const apiBaseUrl: string =
  process.env.NODE_ENV === 'unittest'
    ? 'http://ndla-api'
    : config.ndlaApiGatewayUrl;

/**
 * Join base URL with a given path.
 */
export function apiResourceUrl(path: string): string {
  return apiBaseUrl + path;
}

/**
 * Shape of an error JSON response (best-effort; unknown keys allowed).
 */
type ErrorJson = {
  message?: string;
  [key: string]: unknown;
};

/**
 * Resolve a fetch Response as JSON (or undefined for 204) or throw
 * a structured error produced by createErrorPayload.
 *
 * Returns the parsed JSON typed as T (default unknown) or undefined for 204.
 *
 * @param res Fetch API Response
 * @throws Error (augmented with status & json) when response not ok
 */
export async function resolveJsonOrRejectWithError<T = unknown>(
  res: Response,
): Promise<T | undefined> {
  if (res.ok) {
    if (res.status === 204) return undefined;
    return (await res.json()) as T;
  }

  let json: ErrorJson = {};
  try {
    json = (await res.json()) as ErrorJson;
  } catch {
    // Ignore JSON parse errors for non-OK responses
  }

  log.warn('Api call failed', {
    url: res.url,
    status: res.status,
    statusText: res.statusText,
    body: json,
  });

  const message = json.message ?? res.statusText;
  throw createErrorPayload(res.status, message, json);
}
