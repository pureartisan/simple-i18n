import escapeStringRegexp from 'escape-string-regexp';

import { DefaultRules } from './default-rules';

const REGEX_RULES_EXTRACTOR = /\{(\w+),?([\w\:\-]+)?\}/g;

export class RulesManager {

  constructor({ rules } = {}) {
    this.rules = {
      ...DefaultRules,
      ...rules
    };
  }

  process(str, args) {

    const replacements = RulesManager.findCaptureGroups(str);
    Object.keys(replacements).forEach((match) => {
      const replacement = replacements[match];
      const data = args[replacement.name];
      const rule = this.rules[replacement.rule] || this.rules.string;
      const search = new RegExp(escapeStringRegexp(match), 'g');
      str = str.replace(search, rule(data, replacement.name));
    });

    return str;

  }

  static findCaptureGroups(str) {

    const groups = {};

    let match = REGEX_RULES_EXTRACTOR.exec(str);
    while (match != null) {

      // matched text: match[0]
      // match start: match.index
      // capturing group n: match[n]

      const fullMatch = match[0];
      groups[fullMatch] = {
        name: match[1],
        rule: match[2]
      };

      match = REGEX_RULES_EXTRACTOR.exec(str);
    }

    return groups;

  }

}
