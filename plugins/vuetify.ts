import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify, type ThemeDefinition } from "vuetify";

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#2563eb",
    secondary: "#1d4ed8",
    accent: "#60a5fa",
    error: "#ef4444",
    info: "#3b82f6",
    success: "#10b981",
    warning: "#f59e0b",
    "on-primary": "#ffffff",
    "on-secondary": "#ffffff",
    background: "#f8fafc",
    surface: "#ffffff",
  },
};

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#3b82f6",
    secondary: "#2563eb",
    accent: "#60a5fa",
    error: "#ef4444",
    info: "#3b82f6",
    success: "#10b981",
    warning: "#f59e0b",
    "on-primary": "#ffffff",
    "on-secondary": "#ffffff",
    background: "#0f172a",
    surface: "#1e293b",
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