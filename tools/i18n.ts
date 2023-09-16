import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../assets/locales/en.json';
import fr from '../assets/locales/fr.json';
import es from '../assets/locales/es.json';
import cn from '../assets/locales/cn.json';
import { getLocales } from 'expo-localization'

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
  es: {
    translation: es,
  },
  cn: {
    translation: cn,
  },
}

const currentLocale = getLocales()[0].languageCode

i18n.use(initReactI18next).init({
  resources,
  lng: currentLocale,
  fallbackLng: 'en',
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false
  }
})

export default i18n;