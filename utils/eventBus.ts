import { reactive } from "vue";

interface EventBusType {
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const eventBus = reactive<EventBusType>({
  isDarkMode: false,

  setDarkMode(value: boolean): void {
    this.isDarkMode = value;
  },
});
