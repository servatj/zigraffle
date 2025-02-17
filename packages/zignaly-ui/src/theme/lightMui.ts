import { createTheme } from "@mui/material/styles";
import light from "./light";

const lightMui = createTheme({
  palette: {
    ...light,

    primary: {
      main: light.highlighted,
    },

    secondary: {
      dark: "#191927",
      main: "#656565",
    },

    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: ["Avenir Next", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
  },
  components: {
    // Name of the component
    MuiButtonBase: {
      defaultProps: {
        // The props to change the default for.
      },
    },
  },
});

export default lightMui;
