/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Ambient type declarations for 'swagger-ui-dist'.
 *
 * The real package exports static assets plus a helper function `absolutePath`
 * which returns the on-disk path to the bundled Swagger UI distribution.
 *
 * We only use `absolutePath()` on the server side to serve the static assets.
 * These minimal typings avoid TypeScript "implicitly has an any type" warnings.
 *
 * If more granular typing is required in the future (e.g. for programmatic
 * SwaggerUIBundle usage in a Node environment), extend this file accordingly.
 */

declare module 'swagger-ui-dist' {
  /**
   * Returns an absolute filesystem path pointing to the directory that
   * contains the Swagger UI distribution (CSS, JS, favicon, etc.).
   *
   * Example:
   *   import { absolutePath } from 'swagger-ui-dist';
   *   app.use('/swagger-ui-dist', express.static(absolutePath()));
   */
  export function absolutePath(): string;
}

/**
 * In browser context (served assets), a global `SwaggerUIBundle` function is
 * injected by swagger-ui's bundle script. We only reference it indirectly in
 * generated HTML, but if you later add TypeScript that manipulates it in a
 * browser runtime (e.g. via a frontend bundle), you can uncomment and refine
 * the declaration below.
 *
 * Uncomment and adjust if needed:
 *
 * declare const SwaggerUIBundle: (config: Record<string, unknown>) => {
 *   initOAuth?(params: Record<string, unknown>): void;
 * };
 */
