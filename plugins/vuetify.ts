import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify, type ThemeDefinition } from "vuetify";

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#4568dc",
    secondary: "#b06ab3",
    accent: "#8c9eff",
    error: "#ff5252",
    info: "#2196f3",
    success: "#4caf50",
    warning: "#ffc107",
    "on-primary": "#ffffff",
    "on-secondary": "#ffffff",
    background: "#ffffff",
    surface: "#ffffff",
  },
};

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#5d7ce4",
    secondary: "#c07ec0",
    accent: "#a2b0ff",
    error: "#ff5252",
    info: "#2196f3",
    success: "#4caf50",
    warning: "#ffc107",
    "on-primary": "#ffffff",
    "on-secondary": "#ffffff",
    background: "#121212",
    surface: "#121212",
  },
};

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "lightTheme",
      themes: {
        lightTheme,
        darkTheme,
      },
    },
    defaults: {
      VBtn: {
        rounded: true,
      },
      VCard: {
        rounded: "lg",
      },
      VTextField: {
        variant: "outlined",
        density: "comfortable",
      },
    },
  });

  app.vueApp.use(vuetify);
});
