const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
//const middleware = require('i18next-http-middleware');

require('dotenv').config();
i18next
  .use(Backend)
  //.use(middleware.LanguageDetector)
  .init({
    fallbackLng: process.env.LANGUAGE,
    backend: {
      loadPath: __dirname + '/../locales/{{lng}}/{{ns}}.json', // Adjust the path as needed
    },
    // other options if necessary
  });

module.exports = i18next;