/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

type ErrorLike = Error & {
  status?: number;
  json?: { description?: string; [key: string]: unknown };
  stack?: string;
};
/**
 * Get appropriate error object with correct status.
 * Strips stacktrace when in production mode by default.
 *
 * @param {any} error Unknown error input
 * @param {boolean} isProduction Whether to hide stacktrace
 * @returns {{status:number,message:string,description:string,stacktrace:string}}
 */
export const getAppropriateErrorResponse = (
  error: unknown,
  isProduction = true,
): {
  status: number;
  message: string;
  description: string;
  stacktrace: string;
} => {
  const err = (error as ErrorLike) || {};
  const status =
    typeof err.status === 'number' && Number.isFinite(err.status)
      ? err.status
      : 500;
  const description =
    err.json && typeof err.json === 'object' && err.json.description
      ? err.json.description
      : '';
  const message = err.message || 'Unknown error';

  return {
    status,
    message,
    description,
    stacktrace: isProduction ? '' : err.stack || '',
  };
};

/**
 * Create a new Error with additional info
 *
 * @param {number} status Http status to include in error payload
 * @param {string} message Error message
 * @param {object} json JSON response from failed api calls
 * @returns {Error & {status:number,json:object}}
 */
export function createErrorPayload(
  status: number,
  message: string,
  json: Record<string, unknown>,
): ErrorLike {
  const base = new Error(message) as ErrorLike;
  base.status = status;
  base.json = json;
  return base;
}
