const DEFAULT_LOCALE = 'common';

export class LocaleManager {

  constructor({ locale, languages } = {}) {
    this._transformLanguages(languages || {});
    this.setLocale(locale);
  }

  setLocale(locale) {
    this.locale = locale;
    this._resolveLanguage(locale || '');
  }

  getLanguage() {
    return this.language;
  }

  _transformLanguages(languages) {
    this.languages = {};
    Object.keys(languages).map((locale) => {
      this.languages[locale.trim().toLowerCase()] = languages[locale];
    });
  }

  _resolveLanguage(locale) {
    this.language = {
      ...(this.languages[DEFAULT_LOCALE] || {}) // starts with default locale
    };
    const parts = locale.trim().toLowerCase().split('-');
    for (let i=0; i<=parts.length; i++) {
      const locale = parts.slice(0, i).join('-');
      if (locale && locale !== '') {
        this.language = {
          ...this.language,
          ...(this.languages[locale] || {})
        };
      }
    }
  }

}
