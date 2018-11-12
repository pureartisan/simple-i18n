import moment from 'moment';
import { expect, use as chaiUse } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';

import { RulesManager } from '../src/rules-manager';
import { SimpleI18n } from '../src/simple-i18n';

chaiUse(sinonChai);

describe('SimpleI18n - Rules', () => {

    let i18n;

    beforeEach(() => {
      i18n = new SimpleI18n();
    });

    describe('default rules', () => {

      it('should have "string" rule by built in', () => {
          const languages = {
            'en': {
              'foo': '{name,string}'
            }
          };
          i18n.init({ languages, locale: 'en' });
          expect(i18n.translate('foo', { name: 'Bob' })).to.equal('Bob');
      });

      it('should use "string" rule by default if rule is not specified', () => {
          const languages = {
            'en': {
              'foo': '{name}'
            }
          };
          i18n.init({ languages, locale: 'en' });
          expect(i18n.translate('foo', { name: 'Bob' })).to.equal('Bob');
      });

      it('should not allow whitespace in rule specifying', () => {
          const languages = {
            'en': {
              'foo': '{ name, string }'
            }
          };
          i18n.init({ languages, locale: 'en' });
          expect(i18n.translate('foo', { name: 'Bob' })).to.equal('{ name, string }'); // rule is ignored
      });

    });

    describe('custom rules', () => {

      it('should allow custom rules', () => {
          const languages = {
            'en': {
              'foo': '{name,to-upper}'
            }
          };
          const rules = {
            'to-upper': (value) => (value || '').toUpperCase()
          };
          i18n.init({ languages, locale: 'en', rules });
          expect(i18n.translate('foo', { name: 'Bob' })).to.equal('BOB');
      });

      it('should allow custom rules that depends on locale', () => {
          const languages = {
            'en': {
              'greeting-today': 'Today is {today,date}',
              'date-format': 'DD-MM-YYYY'
            },
            'en-us': {
              'date-format': 'MM/DD/YYYY'
            }
          };
          const rules = {
            'date': (value) => {
              const dateFormat = i18n.raw('date-format');
              return moment(value).format(dateFormat);
            }
          };
          i18n.init({ languages, locale: 'en', rules });

          const today = moment('2018-12-25');
          const opts = {
            today: today.toDate()
          };

          // already set to 'en'
          expect(i18n.translate('greeting-today', opts)).to.equal('Today is 25-12-2018');

          i18n.setLocale('en-us');
          expect(i18n.translate('greeting-today', opts)).to.equal('Today is 12/25/2018');

      });

    });

});
