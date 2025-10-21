/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createLogger, format, transports, Logger } from 'winston';

/**
 * Winston logger instance for the service.
 * Exported as default (ES module style).
 */
const log = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service: 'api-documentation' },
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: [new transports.Console()],
});

/**
 * Helper that logs a value and returns it unchanged.
 * Useful for functional chains / debugging.
 */
export function logAndReturnValue<T>(
  level: string | 'silent',
  msg: string,
  value: T,
): T {
  if (level !== 'silent') {
    // Winston logger has a generic 'log' method for dynamic levels
    if (typeof (log as Logger).log === 'function') {
      (log as Logger).log(level, msg, value);
    }
  }
  return value;
}

// Attach helper for backward compatibility with previous usage pattern
(
  log as Logger & { logAndReturnValue: typeof logAndReturnValue }
).logAndReturnValue = logAndReturnValue;

export default log;
