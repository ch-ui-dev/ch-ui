// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>
// Based upon @tailwindcss/vite, fetched on 9 April 2024 from <https://github.com/tailwindlabs/tailwindcss/blob/next/packages/%40tailwindcss-vite/package.json>

import path from 'node:path';
import type { Plugin, Update, ViteDevServer } from 'vite';
import { type BundleParams, makeSprite, scanString } from '@ch-ui/icons';
import pm from 'picomatch';

export default function vitePluginChUiIcons(params: BundleParams): Plugin[] {
  const { tokenPattern, contentPath } = params;

  const isContent = pm(contentPath);

  function shouldIgnore(id: string, src: string) {
    return !isContent(id);
  }

  let server: ViteDevServer | null = null;
  let detectedTokens = new Set<string>();
  let updated = true;
  // In serve mode this is treated as a set — the content doesn't matter.
  // In build mode, we store file contents to use them in renderChunk.
  let iconModules: Record<
    string,
    {
      content: string;
      handled: boolean;
    }
  > = {};

  function scan(src: string) {
    let updated = false;
    const nextCandidates = scanString({
      contentString: src,
      tokenPattern,
    });
    Array.from(nextCandidates).forEach((candidate) => {
      if (!detectedTokens.has(candidate)) {
        updated = true;
      }
      detectedTokens.add(candidate);
    });
    return updated;
  }

  return [
    {
      // Step 1: Scan source files for detectedTokens
      name: '@ch-ui/icons:scan',
      enforce: 'pre',

      configureServer(_server) {
        server = _server;
      },

      transformIndexHtml(html) {
        scan(html);
        updated = true;
      },

      transform(src, id, options) {
        if (shouldIgnore(id, src)) return;
        scan(src);
        updated = true;
      },
    },

    {
      // Step 2 (serve mode): Generate Icons
      name: '@ch-ui/icons:generate:serve',
      apply: 'serve',

      async transform(src, id, options) {
        if (shouldIgnore(id, src)) return;

        if (!options?.ssr) {
          // Wait until all other files have been processed, so we can extract
          // all detected tokens before generating the sprite. This must not be
          // called during SSR, or it will block the server.
          await server?.waitForRequestsIdle?.(id);
        }

        if (updated) {
          await makeSprite(params, detectedTokens);
          updated = false;
        }

        return { code: src };
      },
    },

    {
      // Step 2 (full build): Generate sprite
      name: '@ch-ui/icons:generate:build',
      apply: 'build',

      // renderChunk runs in the bundle generation stage after all transforms.
      async renderChunk(_code, _chunk) {
        for (let [id, file] of Object.entries(iconModules)) {
          if (file.handled) {
            continue;
          }
          file.handled = true;
          console.warn(
            '[@ch-ui/vite-plugin-icons]',
            'not implemented',
            id,
            file,
          );
        }
      },
    },
  ] satisfies Plugin[];
}
