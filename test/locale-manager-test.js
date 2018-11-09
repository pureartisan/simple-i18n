import { expect, use as chaiUse } from 'chai';
import { stub, spy } from 'sinon';
import sinonChai from 'sinon-chai';

import { LocaleManager } from '../src/locale-manager';

chaiUse(sinonChai);

describe('LocaleManager', () => {

    describe('initialising', () => {

        it('should not throw error when initialising', () => {
            expect(() => new LocaleManager()).to.not.throw();
        });

        it('should set empty language set as default', () => {
            const manager = new LocaleManager();
            expect(manager.getLanguage()).to.deep.equal({});
        });

        it('should default to "common" if given locale cannot be found', () => {
            const languages = {
              'common': {
                'common-key': 'common-value'
              }
            };
            const manager = new LocaleManager({
              languages,
              locale: 'en'
            });
            expect(manager.getLanguage()).to.deep.equal({
              'common-key': 'common-value'
            });
        });

        it('should merge languages basing from common', () => {
            const languages = {
              'common': {
                'common-key-1': 'common-value-1'
              },
              'en': {
                'en-key-1': 'en-value-1'
              }
            };
            const manager = new LocaleManager({
              languages,
              locale: 'en'
            });
            expect(manager.getLanguage()).to.deep.equal({
              'common-key-1': 'common-value-1',
              'en-key-1': 'en-value-1'
            });
        });

        it('should merge languages basing from common and overriding same keys', () => {
            const languages = {
              'common': {
                'common-key-1': 'common-value-1',
                'foo': 'common-value-2'
              },
              'en': {
                'en-key-1': 'en-value-1',
                'foo': 'en-value-2'
              }
            };
            const manager = new LocaleManager({
              languages,
              locale: 'en'
            });
            expect(manager.getLanguage()).to.deep.equal({
              'common-key-1': 'common-value-1',
              'en-key-1': 'en-value-1',
              'foo': 'en-value-2'
            });
        });

        it('should merge languages with sub-locales', () => {
            const languages = {
              'common': {
                'common-key-1': 'common-value-1',
                'foo': 'common-value-2'
              },
              'en': {
                'en-key-1': 'en-value-1',
                'foo': 'en-value-2'
              },
              'en-uk': {
                'en-uk-key-1': 'en-uk-value-1',
                'foo': 'en-uk-value-2'
              }
            };
            const manager = new LocaleManager({
              languages,
              locale: 'en-uk' // sub locale
            });
            expect(manager.getLanguage()).to.deep.equal({
              'common-key-1': 'common-value-1',
              'en-key-1': 'en-value-1',
              'en-uk-key-1': 'en-uk-value-1',
              'foo': 'en-uk-value-2'
            });
        });

        it('should not use sub-language with local is not sub-locale', () => {
            const languages = {
              'common': {
                'common-key-1': 'common-value-1',
                'foo': 'common-value-2'
              },
              'en': {
                'en-key-1': 'en-value-1',
                'foo': 'en-value-2'
              },
              'en-uk': {
                'en-uk-key-1': 'en-uk=value-1',
                'foo': 'en-uk-value-2'
              }
            };
            const manager = new LocaleManager({
              languages,
              locale: 'en'  // ONLY 'en'
            });
            expect(manager.getLanguage()).to.deep.equal({
              'common-key-1': 'common-value-1',
              'en-key-1': 'en-value-1',
              'foo': 'en-value-2'
            });
        });

    });

    describe('setLocale', () => {

      it('should update merged language correctly', () => {
        // original
        const languages = {
          'common': {
            'common-key-1': 'common-value-1',
            'foo': 'common-value-2'
          },
          'en': {
            'en-key-1': 'en-value-1',
            'foo': 'en-value-2'
          },
          'en-uk': {
            'en-uk-key-1': 'en-uk-value-1',
            'foo': 'en-uk-value-2'
          }
        };

        // en-uk is set originally
        const manager = new LocaleManager({
          languages,
          locale: 'en-uk'
        });
        expect(manager.getLanguage()).to.deep.equal({
          'common-key-1': 'common-value-1',
          'en-key-1': 'en-value-1',
          'en-uk-key-1': 'en-uk-value-1',
          'foo': 'en-uk-value-2'
        });

        // update locale to en
        manager.setLocale('en');
        expect(manager.getLanguage()).to.deep.equal({
          'common-key-1': 'common-value-1',
          'en-key-1': 'en-value-1',
          'foo': 'en-value-2'
        });

      });

      it('should not fail if given locale doesn\'t exist', () => {
        // original
        const languages = {
          'en': {
            'foo': 'bar'
          }
        };

        // en is set originally
        const manager = new LocaleManager({
          languages,
          locale: 'en'
        });
        expect(manager.getLanguage()).to.deep.equal({
          'foo': 'bar'
        });

        // update locale to de
        manager.setLocale('de');
        expect(manager.getLanguage()).to.deep.equal({});

      });

      it('should not be case sensitive when using locale', () => {
          const languages = {
            'EN': {
              'foo': 'bar'
            },
            'de': {
              'hello': 'world'
            }
          };
          const manager = new LocaleManager({
            languages,
            locale: 'DE'  // wrong case
          });

          // still valid
          expect(manager.getLanguage()).to.deep.equal({
            'hello': 'world'
          });

          manager.setLocale('en'); // wrong case
          expect(manager.getLanguage()).to.deep.equal({
            'foo': 'bar'
          });
      });

    });

});
