import { createMuiTheme } from '@material-ui/core';

export function getTheme(mode: "light"|"dark" = "light") {
  return createMuiTheme({
    palette: {
      type: mode,
      primary: {
        main: "#F50057"
      },
      secondary: {
        main: "#01A8D5"
      },
      background: {
        default: mode === "light" ? "#DFDFDF" : "#151515",
        paper: mode === "light" ? "#f9faff" : "#3D4048"
      }
    },
    typography: {
      fontFamily: "Inter, Sen, sans-serif",
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