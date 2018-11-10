import { expect, use as chaiUse } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';

import { RulesManager } from '../src/rules-manager';
import { SimpleI18n } from '../src/simple-i18n';

chaiUse(sinonChai);

describe('SimpleI18n - Translate', () => {

    let i18n;

    beforeEach(() => {
      i18n = new SimpleI18n();
    });

    describe('initialised', () => {

      it('should throw error if not initialised before calling translate', () => {
          expect(() => i18n.translate('foo')).to.throw();
      });

      it('should not throw error if initialised before calling translate', () => {
          const languages = {
            'en': {}
          };
          const locale = 'en';
          i18n.init({ locale, languages });
          expect(() => i18n.translate('foo')).to.not.throw();
      });

    });

    describe('general transalte', () => {

      it('should show missing key when key doesn\'t exist', () => {
          const languages = {
            'en': {
              'foo': 'static string'
            }
          };
          i18n.init({ languages, locale: 'en' });
          expect(i18n.translate('bar')).to.equal("[missing.i18n.translation:'bar']");
      });

      it('should translate static string', () => {
          const languages = {
            'en': {
              'foo': 'static string'
            }
          };
          i18n.init({ languages, locale: 'en' });
          expect(i18n.translate('foo')).to.equal('static string');
      });

      it('should translate empty static string', () => {
          const languages = {
            'en': {
              'foo': ''
            }
          };
          i18n.init({ languages, locale: 'en' });
          expect(i18n.translate('foo')).to.equal('');
      });

    });

    describe('variables', () => {

      let rulesManagerProcessSpy;

      beforeEach(() => {
        rulesManagerProcessSpy = spy(RulesManager.prototype, 'process');
      });

      afterEach(() => {
        rulesManagerProcessSpy.restore();
      });

      it('should replace variables using rules manager', () => {
          const languages = {
            'en': {
              'foo': 'Hello {firtName}'
            }
          };
          i18n.init({ languages, locale: 'en' });

          const args = {firtName: 'Bob'};
          const result = i18n.translate('foo', args);

          expect(result).to.equal('Hello Bob');

          expect(rulesManagerProcessSpy).to.have.been.calledOnce;
          expect(rulesManagerProcessSpy).to.have.been.calledWith('Hello {firtName}', args);
      });

      it('should replace variables using custom rules', () => {
          const customRule = spy((x) => x.toUpperCase());
          const languages = {
            'en': {
              'foo': 'Hello {firtName,custom}'
            }
          };
          const rules = {
            custom: customRule
          };
          i18n.init({ languages, locale: 'en', rules });

          const args = {firtName: 'Bob'};
          const result = i18n.translate('foo', args);

          expect(result).to.equal('Hello BOB');

          expect(rulesManagerProcessSpy).to.have.been.calledOnce;
          expect(rulesManagerProcessSpy).to.have.been.calledWithMatch('Hello {firtName,custom}', args);

          expect(customRule).to.have.been.calledOnce;
      });

      it('should replace variables with empty strings if not provided in args', () => {
          const languages = {
            'en': {
              'foo': 'Hello {firtName}, how are you?'
            }
          };
          i18n.init({ languages, locale: 'en' });

          const args = {lastName: 'Smith'}; // not first name
          const result = i18n.translate('foo', args);

          expect(result).to.equal('Hello , how are you?');

          expect(rulesManagerProcessSpy).to.have.been.calledOnce;
          expect(rulesManagerProcessSpy).to.have.been.calledWith('Hello {firtName}, how are you?', args);
      });

    });

    describe('locale', () => {

      it('should allow switching locale', () => {
          const languages = {
            'en': {
              'foo': 'Hi {firstName}'
            },
            'de': {
              'foo': 'Hallo {firstName}'
            }
          };
          i18n.init({ languages, locale: 'en' });

          const args = {firstName: 'Bob'};

          // originally using 'en'
          expect(i18n.translate('foo', args)).to.equal('Hi Bob');

          // now switch to 'de'
          i18n.setLocale('de');
          expect(i18n.translate('foo', args)).to.equal('Hallo Bob');
      });

      it('should default locale to common when non existant', () => {
          const languages = {
            'common': {
              'foo': 'Hi {firstName}'
            }
          };
          i18n.init({ languages, locale: 'en' });

          const args = {firstName: 'Bob'};

          // defaults to 'common'
          expect(i18n.translate('foo', args)).to.equal('Hi Bob');
      });

      it('should allow switching locale, but report missing key when invalid locale', () => {
          const languages = {
            'en': {
              'foo': 'Hi {firstName}'
            },
            'de': {
              'foo': 'Hallo {firstName}'
            }
          };
          i18n.init({ languages, locale: 'en' });

          const args = {firstName: 'Bob'};

          // originally using 'en'
          expect(i18n.translate('foo', args)).to.equal('Hi Bob');

          // now switch to 'fr'
          i18n.setLocale('fr'); // invalid local
          expect(i18n.translate('foo', args)).to.equal("[missing.i18n.translation:'foo']");
      });

      it('should allow switching locale, but report missing key when key doesn\'t exist', () => {
          const languages = {
            'en': {
              'foo': 'Hi {firstName}'
            },
            'de': {
              'bar': 'Bye {firstName}'
            }
          };
          i18n.init({ languages, locale: 'en' });

          const args = {firstName: 'Bob'};

          // originally using 'en'
          expect(i18n.translate('foo', args)).to.equal('Hi Bob');

          // now switch to 'de'
          i18n.setLocale('de'); // valid local, but missing
          expect(i18n.translate('foo', args)).to.equal("[missing.i18n.translation:'foo']");
      });

      it('should allow switching sub-locale and use derived translations', () => {
          const languages = {
            'en': {
              'foo': 'Hi',
              'bar': 'How are you?'
            },
            'en-uk': {
              'bar': 'You alright?'
            }
          };
          i18n.init({ languages, locale: 'en' });

          // originally using 'en'
          expect(i18n.translate('foo')).to.equal('Hi');
          expect(i18n.translate('bar')).to.equal('How are you?');

          // now switch to 'en-uk'
          i18n.setLocale('en-uk');
          expect(i18n.translate('foo')).to.equal('Hi'); // derived from 'en'
          expect(i18n.translate('bar')).to.equal('You alright?');
      });

    });

});
