/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import pino from 'pino';

/**
 * Pino logger instance for the service.
 * Exported as default (ES module style).
 */
const log = pino({
  name: 'api-documentation',
  level: process.env.LOG_LEVEL || 'info',
});

/**
 * Helper that logs a value and returns it unchanged.
 * Useful for functional chains / debugging.
 */
export function logAndReturnValue<T>(
  level: pino.Level | 'silent',
  msg: string,
  value: T,
): T {
  // @ts-ignore dynamic level indexing
  (log as any)[level](msg, value);
  return value;
}

// Attach helper for backward compatibility with previous usage pattern
// (log.logAndReturnValue(...))
(log as any).logAndReturnValue = logAndReturnValue;

export default log;
