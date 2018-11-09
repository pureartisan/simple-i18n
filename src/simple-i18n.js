import { RulesManager } from './rules-manager';

const MISSING_PREFIX = 'missing.i18n.translation';

/**
 * Usage: 'Some test {<name>,<format>}'
 * Example: 'Hello {name,string}'
 */
class SimpleI18n {

  constructor() {
    this._initialised = false;
    this._languages = {};
    this._currentLanguage = {};
    this._rulesManager = null;
  }

  init({ language, languages, rules }) {
    this._initialised = true;
    this._languages = languages;
    this._rulesManager = new RulesManager({ rules });
    this.setLanguage(language);
  }

  setLanguage(language) {
    this._currentLanguage = this._languages[language] || {};
  }

  translate(key, args) {
    const str = this._currentLanguage[key];
    if (!str) {
        return `[${MISSING_PREFIX}:'${key}']`;
    }
    return this.process(str, args || {});
  }

  raw(key) {
    return this._currentLanguage[key];
  }

  process(str, args = {}) {
    return this._rulesManager.process(str, args || {});
  }

  hasKey(key) {
    return (key in this._currentLanguage);
  }

}

// use singleton
const simpleI18n = new SimpleI18n();

export {
  simpleI18n as SimpleI18n
};
