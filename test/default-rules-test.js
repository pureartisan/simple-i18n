import { expect } from 'chai';
import { DefaultRules } from '../src/default-rules';

describe('DefaultRules', () => {

    describe('string', () => {

      it('should be a function', () => {
          expect(DefaultRules.string).to.be.a('function');
      });

      testReturnsByArgs(DefaultRules.string, [
        { input: undefined, output: '', label: 'empty string' },
        { input: null, output: '', label: 'empty string' },
        { input: '', output: '', label: 'empty string' },
        { input: 0, output: '0' },
        { input: '0', output: '0' },
        { input: 'hello', output: 'hello' },
        { input: 'hello world', output: 'hello world' },
        { input: '<html-tag>', output: '<html-tag>' },
        { input: 123, output: '123' },
        { input: {}, output: {}.toString() },
      ]);

      function testReturnsByArgs(func, data) {
        data.forEach(({ input, output, label }) => {
          it(`should return '${label || output}' when input is '${input}'`, () => {
              expect(func(input)).to.equal(output);
          });
        });
      }

    });


});
