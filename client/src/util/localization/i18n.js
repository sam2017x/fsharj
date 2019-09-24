import * as messages from './index';

let locale = document.documentElement.lang;
let localeChanged = false;

if (!locale) {
  locale = 'fi';
}

if (locale.includes('-') && locale.length > 2) {
  locale = locale.slice(0, 2);
}

let translations = messages[locale];

const translate = (key, ...vars) => {
  // eslint-disable-next-line
  key += vars.length > 0 ? '.value' : '';
  if (!translations[key]) {
    // eslint-disable-next-line no-console
    console.warn(`Translation ${key} is missing`);
    return '';
  }
  return translations[key].replace(/{(\d+)}/g, (m, p1) => vars[p1]);
};

const memoize = method => {
  let cache = {};
  return (...args) => {
    if (localeChanged && cache) {
      cache = {};
      localeChanged = false;
    }
    const key = JSON.stringify(args);
    cache[key] = cache[key] || method.apply(this, args);
    return cache[key];
  };
};

export const setLocale = newLang => {
  locale = newLang;
  translations = messages[locale];
  localeChanged = true;
};

export default memoize(translate);
