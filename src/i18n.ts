// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from './locales/en/translation.json';
import translationZH from './locales/zh/translation.json';

const resources = {
  en: {
    translation: translationEN
  },
  zh: {
    translation: translationZH
  }
};

i18n
  .use(LanguageDetector) // 自动检测用户语言
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // 当检测到的语言没有对应的翻译时，使用英语作为回退
    debug: true, // 在开发模式下启用 debug 模式，会在控制台输出信息

    interpolation: {
      escapeValue: false // react already safes from xss
    },

    // 默认命名空间，可以有多个命名空间
    // defaultNS: 'translation', 
  });

export default i18n;