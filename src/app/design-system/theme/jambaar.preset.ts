import { definePreset } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';

export const JAMBAAR_PRESET = definePreset(Lara, {
  semantic: {
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#e8722a',
      600: '#c95b16',
      700: '#9a4313',
      800: '#7c3716',
      900: '#652f16',
      950: '#361506',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#fafafa',
          100: '#f4f4f4',
          200: '#e5e7eb',
          900: '#1a1a2e',
          950: '#01001f',
        },
      },
    },
  },
  components: {
    button: {
      root: {
        borderRadius: '0.5rem',
      },
    },
    inputtext: {
      root: {
        borderRadius: '0.5rem',
      },
    },
  },
});
