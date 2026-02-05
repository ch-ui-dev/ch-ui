// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { type BundleParams, makeSprite, scanString } from '@ch-ui/icons';
import picomatch from 'picomatch';
import type { Compiler } from 'webpack';
import { resolve } from 'path';

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

  apply(compiler: Compiler) {
    const {
      spriteFile,
      assetPath,
      symbolPattern,
      contentPaths,
      config,
      verbose,
    } = this.params;

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
