import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify, type ThemeDefinition } from "vuetify";

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#667eea",
    secondary: "#764ba2",
    accent: "#f093fb",
    error: "#ff5252",
    info: "#2196f3",
    success: "#4caf50",
    warning: "#ffc107",
    "on-primary": "#ffffff",
    "on-secondary": "#ffffff",
    background: "#fafafa",
    surface: "#ffffff",
  },
};

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#667eea",
    secondary: "#764ba2",
    accent: "#f093fb",
    error: "#ff5252",
    info: "#2196f3",
    success: "#4caf50",
    warning: "#ffc107",
    "on-primary": "#ffffff",
    "on-secondary": "#ffffff",
    background: "#121212",
    surface: "#1e1e1e",
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
        rounded: "lg",
        elevation: 0,
      },
      VCard: {
        rounded: "xl",
        elevation: 2,
      },
      VTextField: {
        variant: "outlined",
        density: "comfortable",
        rounded: "lg",
      },
    },
  });

  app.vueApp.use(vuetify);
});