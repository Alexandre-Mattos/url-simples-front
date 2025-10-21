import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify, type ThemeDefinition } from "vuetify";

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#a855f7",
    secondary: "#ec4899",
    accent: "#f0abfc",
    error: "#ef4444",
    info: "#8b5cf6",
    success: "#10b981",
    warning: "#f59e0b",
    "on-primary": "#ffffff",
    "on-secondary": "#ffffff",
    background: "#000000",
    surface: "#0a0a0a",
  },
};

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#a855f7",
    secondary: "#ec4899",
    accent: "#f0abfc",
    error: "#ef4444",
    info: "#8b5cf6",
    success: "#10b981",
    warning: "#f59e0b",
    "on-primary": "#ffffff",
    "on-secondary": "#ffffff",
    background: "#000000",
    surface: "#0a0a0a",
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