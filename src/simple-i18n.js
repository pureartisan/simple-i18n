import { RulesManager } from './rules-manager';
import { LocaleManager } from './locale-manager';

const MISSING_PREFIX = 'missing.i18n.translation';

/**
 * Usage: 'Some test {<name>,<format>}'
 * Example: 'Hello {name,string}'
 */
class SimpleI18n {

  constructor() {
    this._initialised = false;
    this._localeManager = null;
    this._rulesManager = null;
  }

  init({ locale, languages, rules }) {
    this._initialised = true;
    this._rulesManager = new RulesManager({ rules });
    this._localeManager = new LocaleManager({ locale, languages });
  }

  setLocale(locale) {
    this._localeManager.setLocale(locale);
  }

  translate(key, args) {
    this._validateInitialised();
    const str = this._localeManager.getLanguage()[key];
    if (!str && str !== '') {
        return `[${MISSING_PREFIX}:'${key}']`;
    }
    return this.process(str, args || {});
  }

  raw(key) {
    return this._localeManager.getLanguage()[key];
  }

  hasKey(key) {
    return (key in this._localeManager.getLanguage());
  }

  process(str, args = {}) {
    this._validateInitialised();
    return this._rulesManager.process(str, args || {});
  }

  _validateInitialised() {
    if (!this._initialised) {
      throw Error('SimpleI18n needs to be initialised. Don\'t forget to call init()');
    }
  }

}

// use singleton
const simpleI18n = new SimpleI18n();

export {
  SimpleI18n,
  simpleI18n as SimpleI18nSingleton
};
