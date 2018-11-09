import { expect, use as chaiUse } from 'chai';
import { stub, spy } from 'sinon';
import sinonChai from 'sinon-chai';

import { DefaultRules } from '../src/default-rules';
import { RulesManager } from '../src/rules-manager';

chaiUse(sinonChai);

describe('RulesManager', () => {

    describe('initialising', () => {

        it('should not throw error when initialising', () => {
            expect(() => new RulesManager({})).to.not.throw();
        });

        it('should set default rules', () => {
            const manager = new RulesManager();
            expect(manager.rules).to.deep.equal({
              string: DefaultRules.string
            });
        });

        it('should allow adding additional rules', () => {
            const myDummyRule = stub();
            const manager = new RulesManager({
              rules: {
                myRule: myDummyRule
              }
            });
            expect(manager.rules).to.deep.equal({
              string: DefaultRules.string,
              myRule: myDummyRule
            });
        });

        it('should allow overriding default rules', () => {
            const myDummyRule = stub();
            const manager = new RulesManager({
              rules: {
                string: myDummyRule
              }
            });
            expect(manager.rules).to.deep.equal({
              string: myDummyRule
            });
        });

    });

    describe('findCaptureGroups', () => {

      it('should be a function', () => {
          expect(RulesManager.findCaptureGroups).to.be.a('function');
      });

      it('should not throw an error if input string is not provided or is null', () => {
          expect(() => RulesManager.findCaptureGroups()).to.not.throw();
          expect(() => RulesManager.findCaptureGroups(null)).to.not.throw();
      });

      it('should return capture group with name and rule', () => {
          const input = '{foo,bar}';
          const result = RulesManager.findCaptureGroups(input);
          expect(result).to.deep.equal({
            '{foo,bar}': {
              name: 'foo',
              rule: 'bar'
            }
          });
      });

      it('should return multiple capture groups with name and rule', () => {
          const input = '{foo1,bar1} {foo2,bar2}';
          const result = RulesManager.findCaptureGroups(input);
          expect(result).to.deep.equal({
            '{foo1,bar1}': {
              name: 'foo1',
              rule: 'bar1'
            },
            '{foo2,bar2}': {
              name: 'foo2',
              rule: 'bar2'
            }
          });
      });

      it('should return capture group from long complicated string', () => {
          const input = 'hello {foo,bar}, this has <html-tags />';
          const result = RulesManager.findCaptureGroups(input);
          expect(result).to.deep.equal({
            '{foo,bar}': {
              name: 'foo',
              rule: 'bar'
            }
          });
      });

      it('should return capture group with sub-rule', () => {
          const input = '{foo,bar:sub}';
          const result = RulesManager.findCaptureGroups(input);
          expect(result).to.deep.equal({
            '{foo,bar:sub}': {
              name: 'foo',
              rule: 'bar:sub'
            }
          });
      });

      it('should return capture group with hyphens', () => {
          const input = '{foo,bar-sample:sub-name}';
          const result = RulesManager.findCaptureGroups(input);
          expect(result).to.deep.equal({
            '{foo,bar-sample:sub-name}': {
              name: 'foo',
              rule: 'bar-sample:sub-name'
            }
          });
      });

      it('should not return when name has hyphen', () => {
          const input = '{invalid-name,rule-name}';
          const result = RulesManager.findCaptureGroups(input);
          expect(result).to.be.empty;
      });

      it('should not return when rule has special characters', () => {
          const input = '{foo,inv@lid-rule$}';
          const result = RulesManager.findCaptureGroups(input);
          expect(result).to.be.empty;
      });

    });

    describe('process', () => {

      let stringRuleSpy;

      beforeEach(() => {
        stringRuleSpy = spy(DefaultRules, 'string');
      });

      afterEach(() => {
        stringRuleSpy.restore();
      });

      it('should not throw an error if input string is not provided or is null', () => {
          const manager = new RulesManager();
          expect(() => manager.process()).to.not.throw();
          expect(() => manager.process(null, null)).to.not.throw();
      });

      it('should process rules correctly', () => {
          const manager = new RulesManager();
          const input = '{foo,string}';
          const result = manager.process(input, {foo: 'hello'});
          expect(result).to.equal('hello');
      });

      it('should use "string" rule by default, if rule is not specified', () => {
          const manager = new RulesManager();
          const input = '{foo}';
          const result = manager.process(input, {foo: 'hello'});
          expect(result).to.equal('hello');
          expect(stringRuleSpy).to.have.been.calledOnce;
      });

      it('should use "string" rule by default, if rule is specified is not a valid rule', () => {
          const manager = new RulesManager();
          const input = '{foo,non-existant-rule}';
          const result = manager.process(input, {foo: 'hello'});
          expect(result).to.equal('hello');
          expect(stringRuleSpy).to.have.been.calledOnce;
      });

      it('should use custom rules', () => {
          const customRule = stub().returns('world');
          const manager = new RulesManager({
            rules: {
              'my-rule': customRule
            }
          });
          const input = '{foo,my-rule}';
          const result = manager.process(input, {foo: 'hello'});
          expect(result).to.equal('world');
          expect(stringRuleSpy).to.have.not.been.called;
          expect(customRule).to.have.been.calledOnce;
      });

      it('should call the rules multiple times', () => {
          const manager = new RulesManager();
          const input = '{firstName} {lastName}';
          const result = manager.process(input, {firstName: 'Bob', lastName: 'Smith'});
          expect(result).to.equal('Bob Smith');
          expect(stringRuleSpy).to.have.been.calledTwice;
      });

      it('should pass the data and the variable name to the rule', () => {
          const manager = new RulesManager();
          const input = '{foo} {bar}';
          const args = {foo: 'hello', bar: 'world'};
          const result = manager.process(input, args);
          expect(stringRuleSpy).to.have.been.calledTwice;
          expect(stringRuleSpy.firstCall).to.have.been.calledWith(args['foo'], 'foo');
          expect(stringRuleSpy.secondCall).to.have.been.calledWith(args['bar'], 'bar');
      });

    });

});
