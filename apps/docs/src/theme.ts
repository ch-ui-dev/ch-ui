// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import merge from 'lodash.merge';
import { defaultTheme, SemanticLayer } from '@ch-ui/tokens';

export const docsTheme = merge({}, defaultTheme, {
  colors: {
    semantic: {
      sememes: {
        'illustration-1': {
          light: ['accent', 700],
          dark: ['accent', 900],
        },
        'illustration-2': {
          light: ['accent', 600],
          dark: ['accent', 800],
        },
        'illustration-3': {
          light: ['accent', 500],
          dark: ['accent', 700],
        },
        'illustration-4': {
          light: ['accent', 400],
          dark: ['accent', 600],
        },
        'illustration-5': {
          light: ['accent', 300],
          dark: ['accent', 500],
        },
      } satisfies SemanticLayer['sememes'],
    },
  },
});
