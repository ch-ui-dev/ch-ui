// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>
// Based upon @tailwindcss/vite, fetched on 9 April 2024 from <https://github.com/tailwindlabs/tailwindcss/blob/next/packages/%40tailwindcss-vite/package.json>

import type { Plugin, ViteDevServer } from 'vite';
import { type BundleParams, makeSprite, scanString } from '@ch-ui/icons';
import pm from 'picomatch';

export default function vitePluginChUiIcons(params: BundleParams): Plugin[] {
  const { symbolPattern, contentPaths } = params;

  const pms = contentPaths.map((contentPath) => pm(contentPath));
  const isContent = (id: string) => !!pms.find((pm) => pm(id));

  function shouldIgnore(id: string, src: string) {
    return !isContent(id);
  }

  let server: ViteDevServer | null = null;
  let detectedSymbols = new Set<string>();
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
      symbolPattern,
    });
    Array.from(nextCandidates).forEach((candidate) => {
      if (!detectedSymbols.has(candidate)) {
        updated = true;
      }
      detectedSymbols.add(candidate);
    });
    return updated;
  }

  return [
    {
      // Step 1: Scan source files for detectedSymbols
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
      // Step 2: Write sprite
      name: '@ch-ui/icons:write',

      async transform(src, id, options) {
        // if (!options?.ssr) {
        // // Wait until all other files have been processed, so we can extract
        // // all detected symbols before generating the sprite. This must not be
        // // called during SSR, or it will block the server.
        //   await server?.waitForRequestsIdle?.(id);
        // }

        if (updated) {
          await makeSprite(params, detectedSymbols);
          updated = false;
        }
        return { code: src };
      },
    },
  ] satisfies Plugin[];
}
