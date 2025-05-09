
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {en,ara,Spa,Fr} from './index';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: en,
    ara:ara,
    Fr:Fr,
    Spa:Spa,
  },
  interpolation: {
    escapeValue: false // react already safes from xss
  },
  react: {
    useSuspense:false,
 }
});
export default i18n.t;