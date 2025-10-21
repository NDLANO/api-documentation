/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import http from 'http';
import app from './app';
import config from './config';

const rawPort =
  config.port !== undefined && config.port !== null ? config.port : 3000;
const port: number =
  typeof rawPort === 'string' ? parseInt(rawPort, 10) : rawPort;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});

/**
 * Graceful shutdown on SIGINT / SIGTERM
 */
function shutdown(signal: string) {
  console.log(`${signal} received. Closing server...`);
  server.close((err: Error | undefined) => {
    if (err) {
      console.error('Error during server close', err);
      process.exitCode = 1;
    }
    process.exit();
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default server;
