const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');

require('dotenv').config();

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['cookie', 'querystring', 'header'],
      lookupCookie: 'i18next',
      caches: ['cookie'],
      cookieMinutes: 525600,
      cookieDomain: 'https://8lh8dmll-3002.brs.devtunnels.ms/',
      cookiePath: '/',
    },
  });

module.exports = i18next;