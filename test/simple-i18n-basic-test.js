import { expect, use as chaiUse } from 'chai';
import { stub, spy } from 'sinon';
import sinonChai from 'sinon-chai';

import { RulesManager } from '../src/rules-manager';
import { SimpleI18n } from '../src/simple-i18n';

chaiUse(sinonChai);

describe('SimpleI18n - Basic', () => {

  let i18n;

  beforeEach(() => {
    i18n = new SimpleI18n();
  });

  describe('initialising', () => {

      it('should not throw error when initialising', () => {
          const languages = {
            'en': {}
          };
          const locale = 'en';
          expect(() => i18n.init({ locale, languages })).to.not.throw();
      });

      it('should not throw error when initialising if locale cannot be resolved from languages', () => {
          const languages = {
            'en': {}
          };
          const locale = 'de';
          expect(() => i18n.init({ locale, languages })).to.not.throw();
      });

    });

    describe('raw', () => {

      it('should return "undefined" when key is not found', () => {
          const languages = {
            'en': {
              'foo': 'String with {variable}'
            }
          };
          i18n.init({ languages, locale: 'en' });
          expect(i18n.raw('bar')).to.be.undefined;
      });

      it('should return unprocessed string when key is found', () => {
          const languages = {
            'en': {
              'foo': 'String with {variable}'
            }
          };
          i18n.init({ languages, locale: 'en' });
          expect(i18n.raw('foo')).to.equal('String with {variable}');
      });

    });

    describe('hasKey', () => {

      it('should return true when key exists', () => {
          const languages = {
            'en': {
              'foo': 'abc'
            }
          };
          i18n.init({ languages, locale: 'en' });
          expect(i18n.hasKey('foo')).to.be.true;
      });

      it('should return false when key doesn\'t exists', () => {
          const languages = {
            'en': {
              'foo': 'abc'
            }
          };
          i18n.init({ languages, locale: 'en' });
          expect(i18n.hasKey('bar')).to.be.false;
      });

      it('should return false when locale is different', () => {
          const languages = {
            'en': {
              'foo': 'abc'
            },
            'de': {
              'hello': 'world'
            }
          };
          i18n.init({ languages, locale: 'de' }); // locale de doesn't have 'foo'
          expect(i18n.hasKey('foo')).to.be.false;
      });

    });

    describe('process', () => {

      let rulesManagerProcessStub;

      beforeEach(() => {
        rulesManagerProcessStub = stub(RulesManager.prototype, 'process');
      });

      afterEach(() => {
        rulesManagerProcessStub.restore();
      });

      it('should throw error if not initialised', () => {
          expect(() => i18n.process('foo')).to.throw();
      });

      it('should delegate to RulesManager.process()', () => {
          i18n.init({});

          const args = {myVar: 'dummy'};
          const result = i18n.process('foo', args);

          expect(rulesManagerProcessStub).to.have.been.calledOnce;
          expect(rulesManagerProcessStub).to.have.been.calledWithMatch('foo', args);
      });

      it('should default args to empty object if not provided', () => {
          i18n.init({});

          const result = i18n.process('foo');

          expect(rulesManagerProcessStub).to.have.been.calledOnce;
          expect(rulesManagerProcessStub).to.have.been.calledWithMatch('foo', {});
      });

      it('should return the result of RulesManager.process()', () => {
          const dummyResult = 'hello world';
          rulesManagerProcessStub.returns(dummyResult);

          i18n.init({});

          const result = i18n.process('foo');
          expect(result).to.equal(dummyResult);
      });

    });

});
