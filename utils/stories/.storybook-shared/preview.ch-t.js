const physicalColors = {
  gamuts: ['P3', 'rec2020'],
  shadeNumbering: 'emissive',
  palettes: {
    primary: {
      keyColor: [43, 81, 282],
      darkCp: 0.86,
      lightCp: 1,
      hueTorsion: -30,
    },
  },
};

const semanticColors = {
  themes: { light: null, dark: '@media (prefers-color-scheme: dark)' },
  semanticColors: {
    'ch-bg-input': {
      light: '--primary-100',
      dark: '--primary-900',
    },
  },
};

export default {
  physicalColors,
  semanticColors,
};
