// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { scanString, type BundleParams } from '@ch-ui/icons';
import fg from 'fast-glob';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

export type ValidateIconsParams = Pick<
  BundleParams,
  'symbolPattern' | 'assetPath' | 'contentPaths'
> & { verbose?: boolean };

export type ValidateIconsResult = {
  symbols: Set<string>;
  missing: { symbol: string; expectedPath: string }[];
};

const LABEL = 'validateIcons';

export const validateIcons = ({
  symbolPattern,
  assetPath,
  contentPaths,
  verbose,
}: ValidateIconsParams): ValidateIconsResult => {
  const symbols = new Set<string>();

  if (verbose) {
    console.log(`[${LABEL}] Scanning content globs for icon patterns...`);
  }

  for (const contentPath of contentPaths) {
    const files = fg.sync(contentPath, { absolute: true });

    if (verbose) {
      console.log(
        `[${LABEL}] Found ${files.length} files matching ${contentPath}`,
      );
    }

    for (const file of files) {
      try {
        const src = readFileSync(file, 'utf8');
        const candidates = scanString({
          contentString: src,
          symbolPattern,
        });
        for (const candidate of candidates) {
          symbols.add(candidate);
        }
      } catch (err) {
        if (verbose) {
          console.warn(`[${LABEL}] Could not read file: ${file}`, err);
        }
      }
    }
  }

  if (verbose) {
    console.log(`[${LABEL}] Total detected symbols: ${symbols.size}`);
  }

  const symbolExp = new RegExp(symbolPattern);
  const missing: ValidateIconsResult['missing'] = [];

  for (const symbol of symbols) {
    const match = symbol.match(symbolExp);
    if (match && match[1] && match[2]) {
      const [, ...groups] = match;
      const expectedPath = resolve(assetPath(...groups));
      if (!existsSync(expectedPath)) {
        missing.push({ symbol, expectedPath });
      }
    } else {
      missing.push({ symbol, expectedPath: `(unresolvable: ${symbol})` });
    }
  }

  if (verbose && missing.length > 0) {
    console.log(`[${LABEL}] Missing assets:`);
    for (const { symbol, expectedPath } of missing) {
      console.log(`[${LABEL}]   ${symbol} -> ${expectedPath}`);
    }
  }

  return { symbols, missing };
};
