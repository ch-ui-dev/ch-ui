// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>
// Based upon @tailwindcss/vite, fetched on 9 April 2024 from <https://github.com/tailwindlabs/tailwindcss/blob/next/packages/%40tailwindcss-vite/package.json>

import path from 'node:path';
import type { Plugin, Update, ViteDevServer } from 'vite';
import { type BundleParams, scanString } from '@ch-ui/icons';
import pm from 'picomatch';

export default function vitePluginChUiIcons({
  tokenPattern,
  contentPath,
}: BundleParams): Plugin[] {
  const isContent = pm(contentPath);

  function shouldIgnore(id: string, src: string) {
    return !isContent(id);
  }

  let server: ViteDevServer | null = null;
  let candidates = new Set<string>();
  // In serve mode this is treated as a set — the content doesn't matter.
  // In build mode, we store file contents to use them in renderChunk.
  let iconModules: Record<
    string,
    {
      content: string;
      handled: boolean;
    }
  > = {};
  let isSSR = false;

  // Trigger update to all CSS modules
  function updateIconModules(isSSR: boolean) {
    // If we're building then we don't need to update anything
    if (!server) return;

    let updates: Update[] = [];
    for (let id of Object.keys(iconModules)) {
      let iconModule = server.moduleGraph.getModuleById(id);
      if (!iconModule) {
        // Note: Removing this during SSR is not safe and will produce
        // inconsistent results based on the timing of the removal and
        // the order / timing of transforms.
        if (!isSSR) {
          // It is safe to remove the item here since we're iterating on a copy
          // of the keys.
          delete iconModules[id];
        }
        continue;
      }

      server.moduleGraph.invalidateModule(iconModule);
      updates.push({
        type: `${iconModule.type}-update`,
        path: iconModule.url,
        acceptedPath: iconModule.url,
        timestamp: Date.now(),
      });
    }

    if (updates.length > 0) {
      server.hot.send({ type: 'update', updates });
    }
  }

  function scan(src: string) {
    let updated = false;
    const nextCandidates = scanString({
      contentString: src,
      tokenPattern,
    });
    Array.from(nextCandidates).forEach((candidate) => {
      if (!candidates.has(candidate)) {
        updated = true;
      }
      candidates.add(candidate);
    });
    return updated;
  }

  return [
    {
      // Step 1: Scan source files for candidates
      name: '@ch-ui/icons:scan',
      enforce: 'pre',

      configureServer(_server) {
        server = _server;
      },

      async configResolved(config) {
        isSSR = config.build.ssr !== false && config.build.ssr !== undefined;
      },

      // Scan index.html for candidates
      transformIndexHtml(html) {
        let updated = scan(html);

        if (updated) {
          updateIconModules(isSSR);
        }
      },

      // Scan all non-CSS files for candidates
      transform(src, id, options) {
        if (shouldIgnore(id, src)) return;

        scan(src);

        updateIconModules(options?.ssr ?? false);
      },
    },

    /*
     * The plugins that generate CSS must run after 'enforce: pre' so @imports
     * are expanded in transform.
     */

    {
      // Step 2 (serve mode): Generate Icons
      name: '@ch-ui/icons:generate:serve',
      apply: 'serve',

      async transform(src, id, options) {
        if (shouldIgnore(id, src)) return;
        // In serve mode, we treat iconModules as a set, ignoring the value.
        iconModules[id] = { content: '', handled: true };

        if (!options?.ssr) {
          // Wait until all other files have been processed, so we can extract
          // all candidates before generating CSS. This must not be called
          // during SSR or it will block the server.
          await server?.waitForRequestsIdle?.(id);
        }

        console.log('[serve]', id, options);

        return { code: src };
      },
    },

    {
      // Step 2 (full build): Generate CSS
      name: '@ch-ui/icons:generate:build',
      apply: 'build',

      transform(src, id) {
        if (shouldIgnore(id, src)) return;
        iconModules[id] = { content: src, handled: false };
      },

      // renderChunk runs in the bundle generation stage after all transforms.
      // We must run before `enforce: post` so the updated chunks are picked up
      // by vite:css-post.
      async renderChunk(_code, _chunk) {
        for (let [id, file] of Object.entries(iconModules)) {
          if (file.handled) {
            continue;
          }

          console.log('[render chunk]', id, file);

          file.handled = true;
        }
      },
    },
  ] satisfies Plugin[];
}

function getExtension(id: string) {
  let [filename] = id.split('?', 2);
  return path.extname(filename).slice(1);
}
