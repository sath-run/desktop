import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './lang/en_US';
import zh from './lang/zh_CN';
import {LANGUAGE} from '@/constants';

const defaultLanguage = (localStorage.getItem(LANGUAGE) || 'zh_CN').split('-').join('_');
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en_US: {
        translation: {
          ...en
        }
      },
      zh_CN: {
        translation: {
          ...zh
        }
      }
    },
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false
    }
  });
