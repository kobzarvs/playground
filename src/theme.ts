import type {} from '@mui/lab/themeAugmentation';
import { createTheme } from '@mui/material';

// noinspection TypeScriptValidateTypes
export const theme = createTheme({
  palette: {
    mode: 'light',
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '1rem'
        }
      }
    },
    MuiTypography: {
      variants: [
        {
          props: {variant: 'title'},
          style: {padding: '5px 10px', fontSize: '1.1em', fontWeight: 'bold'}
        },
        {
          props: {variant: 'tree-group'},
          style: {fontWeight: 'bold', flexGrow: 1}
        },
      ],
    },
  },
});
