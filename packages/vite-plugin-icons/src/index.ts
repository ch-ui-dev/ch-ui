// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>
// Based upon @tailwindcss/vite, fetched on 9 April 2024 from <https://github.com/tailwindlabs/tailwindcss/blob/next/packages/%40tailwindcss-vite/package.json>

import { type BundleParams, makeSprite, scanString } from '@ch-ui/icons';
import fs from 'fs';
import picomatch from 'picomatch';
import type { Plugin, ViteDevServer } from 'vite';
import { join, resolve } from 'path';

export type IconsPluginParams = Omit<BundleParams, 'spritePath'> & {
  spriteFile: string;
  verbose?: boolean;
};

export const IconsPlugin = ({
  assetPath,
  symbolPattern,
  contentPaths,
  spriteFile,
  config,
  verbose,
}: IconsPluginParams): Plugin[] => {
  const pms = contentPaths.map((contentPath) =>
    picomatch(contentPath, { windows: true }),
  );
  const isContent = (viteQuery: string) => {
    const [filepath] = viteQuery.split('?');
    return !!pms.find((pm) => pm(filepath));
  };
  const shouldIgnore = (filepath: string) => !isContent(filepath);

  let rootDir: string;
  let spritePath: string;
  let server: ViteDevServer | null = null;
  const detectedSymbols = new Set<string>();
  const visitedFiles = new Set<string>();
  const status = { updated: false };

  const scan = (src: string) => {
    let updated = false;
    const nextCandidates = scanString({ contentString: src, symbolPattern });
    Array.from(nextCandidates).forEach((candidate) => {
      if (!detectedSymbols.has(candidate)) {
        detectedSymbols.add(candidate);
        updated = true;
      }
    });

    return updated;
  };

  return [
    {
      // Step 1: Scan source files incrementally.
      name: '@ch-ui/icons:scan',
      enforce: 'pre',

      configResolved: (config) => {
        rootDir = resolve(config.root);
        spritePath = resolve(config.publicDir, spriteFile);
      },

      configureServer: (_server) => {
        server = _server;

        // Process chunks.
        server.middlewares.use((req, res, next) => {
          if (req.url?.indexOf('/virtual:') === -1) {
            const match = req.url?.match(/^(\/@fs)?(.+)\.(\w+)$/);
            if (match) {
              const [, prefix, path, ext] = match;
              const filename = join((prefix ? '' : rootDir) + `${path}.${ext}`);
              if (!visitedFiles.has(filename)) {
                visitedFiles.add(filename);
                if (isContent(filename)) {
                  try {
                    const src = fs.readFileSync(filename, 'utf8');
                    const match = scan(src);
                    status.updated ||= match;
                  } catch (err) {
                    console.error('Missing file', req.url);
                  }
                }
              }
            }
          }

          next();
        });
      },

      transformIndexHtml: (html) => {
        const match = scan(html);
        status.updated ||= match;
      },

      transform: (src, id) => {
        if (!shouldIgnore(id)) {
          const match = scan(src);
          status.updated ||= match;
        }
      },
    },
    {
      // Step 2: Write sprite.
      // NOTE: This must run before the public directory is copied.
      name: '@ch-ui/icons:write',

      transform: async () => {
        if (status.updated) {
          status.updated = false;
          await makeSprite(
            { assetPath, symbolPattern, spritePath, contentPaths, config },
            detectedSymbols,
          );

          if (verbose) {
            const symbols = Array.from(detectedSymbols.values());
            symbols.sort();
            console.log(
              'Sprite updated:',
              JSON.stringify(
                { path: spritePath, size: detectedSymbols.size, symbols },
                null,
                2,
              ),
            );
          }
        }
      },
    },
  ] satisfies Plugin[];
};
