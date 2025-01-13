import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import enUS from "../public/locales/en-US/common.json";
import ko from "../public/locales/ko/common.json";

export const i18nConfig = {
  resources: {
    "en-US": { translation: enUS },
    ko: { translation: ko },
  },
  lng: "en-US",
  fallbackLng: "en-US",
  interpolation: {
    escapeValue: false,
  },
};

export async function initI18n(locale: string) {
  const i18n = createInstance();
  await i18n
    .use(initReactI18next)
    .init({
      ...i18nConfig,
      lng: locale,
    });
  return i18n;
}
