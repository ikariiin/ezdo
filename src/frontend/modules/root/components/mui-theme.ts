import { createMuiTheme } from '@material-ui/core';

export function getTheme(mode: "light"|"dark" = "light") {
  return createMuiTheme({
    palette: {
      type: mode,
      primary: {
        main: "#EB5757"
      },
      secondary: {
        main: "#01A8D5"
      },
      background: {
        default: mode === "light" ? "#DFDFDF" : "#202020"
      }
    },
    typography: {
      fontFamily: "Roboto, Sen, sans-serif",
      fontWeightBold: 900,
      fontWeightMedium: 500,
      fontWeightRegular: 400,
      fontSize: 15,
      h4: {
        fontWeight: 700,
        fontFamily: "'Josefin Sans', Sen, sans-serif"
      },
      h3: {
        fontWeight: 700,
        fontFamily: "'Josefin Sans', Sen, sans-serif"
      },
      h1: {
        fontWeight: 700,
        fontFamily: "'Josefin Sans', Sen, sans-serif"
      },
      h2: {
        fontWeight: 700,
        fontFamily: "'Josefin Sans', Sen, sans-serif"
      },
      h6: {
        fontWeight: 700,
        fontFamily: "'Josefin Sans', Sen, sans-serif"
      },
      h5: {
        fontWeight: 700,
        fontFamily: "'Josefin Sans', Sen, sans-serif"
      },
    },
    shape: {
      borderRadius: 5
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '@font-face': {
          },
        },
      },
      MuiButton: {
        label: {
          fontSize: '.8rem'
        }
      }
    },
  });
}