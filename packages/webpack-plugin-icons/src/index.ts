// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { type BundleParams, makeSprite, scanString } from '@ch-ui/icons';
import picomatch from 'picomatch';
import type { Compiler } from 'webpack';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import fg from 'fast-glob';

export type IconsPluginParams = Omit<BundleParams, 'spritePath'> & {
  spriteFile: string;
  verbose?: boolean;
};

const PLUGIN_NAME = 'IconsPlugin';

export class IconsPlugin {
  private params: IconsPluginParams;
  private detectedSymbols = new Set<string>();
  private pms: ((path: string) => boolean)[];

  constructor(params: IconsPluginParams) {
    this.params = params;
    this.pms = params.contentPaths.map((contentPath) =>
      picomatch(contentPath, { windows: true }),
    );
  }

  private isContent(filepath: string) {
    return !!this.pms.find((pm) => pm(filepath));
  }

  private scan(src: string) {
    let updated = false;
    const nextCandidates = scanString({
      contentString: src,
      symbolPattern: this.params.symbolPattern,
    });
    for (const candidate of nextCandidates) {
      if (!this.detectedSymbols.has(candidate)) {
        this.detectedSymbols.add(candidate);
        updated = true;
      }
    }
    return updated;
  }

  private async scanAllContentGlobs(contextPath: string) {
    const { contentPaths, verbose } = this.params;

    if (verbose) {
      console.log(`[${PLUGIN_NAME}] Scanning content globs for icon patterns...`);
    }

    for (const contentPath of contentPaths) {
      // Resolve the glob pattern relative to the context path
      const files = await fg(contentPath, {
        cwd: contextPath,
        absolute: true,
        ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
      });

      if (verbose) {
        console.log(`[${PLUGIN_NAME}] Found ${files.length} files matching ${contentPath}`);
      }

      for (const file of files) {
        try {
          const content = readFileSync(file, 'utf-8');
          this.scan(content);
        } catch (err) {
          // Skip files that can't be read
          if (verbose) {
            console.warn(`[${PLUGIN_NAME}] Could not read file: ${file}`, err);
          }
        }
      }
    }

    if (verbose) {
      console.log(`[${PLUGIN_NAME}] Total detected symbols: ${this.detectedSymbols.size}`);
    }
  }

  apply(compiler: Compiler) {
    const {
      spriteFile,
      assetPath,
      symbolPattern,
      contentPaths,
      config,
      verbose,
    } = this.params;

    // Scan all content globs at the start of each compilation
    compiler.hooks.beforeCompile.tapPromise(PLUGIN_NAME, async () => {
      await this.scanAllContentGlobs(compiler.context);
    });

    // Also scan modules as they're processed for additional coverage (e.g., HMR)
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.succeedModule.tap(PLUGIN_NAME, (module) => {
        // @ts-ignore
        const resource = module.resource;
        if (resource && this.isContent(resource)) {
          // @ts-ignore
          const source = module._source?.source();
          if (source) {
            this.scan(source.toString());
          }
        }
      });
    });

    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: PLUGIN_NAME,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        async () => {
          if (this.detectedSymbols.size > 0) {
            const spritePath = resolve(
              compiler.options.output.path || '',
              spriteFile,
            );

            // makeSprite writes to disk, but for Webpack we might want to just get the content.
            // However, makeSprite as implemented in @ch-ui/icons writes to disk.
            // Let's use it as is for now, similar to the Vite plugin.

            await makeSprite(
              { assetPath, symbolPattern, spritePath, contentPaths, config },
              this.detectedSymbols,
            );

            if (verbose) {
              const symbols = Array.from(this.detectedSymbols.values()).sort();
              console.log(
                `[${PLUGIN_NAME}] Generated sprite with ${symbols.length} icons.`,
              );
            }
          }
        },
      );
    });
  }
}
