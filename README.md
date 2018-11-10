# Simple I18n  [![CircleCI](https://circleci.com/gh/prageeth/simple-i18n.svg?style=svg)](https://circleci.com/gh/prageeth/simple-i18n)

Simple and light weight i18n library.

## Installation
```
npm install @prageeths/simple-i18n
```

## Getting started
```
// ES5
var i18n = require('@prageeths/simple-i18n');

// ES6
import i18n from '@prageeths/simple-i18n';

// initialise once at the start
// NOTE: normally you'd want to define the languages and rules on separate files and import them here.

i18n.init({
  locale: 'en',
  languages: {
    'en': { ... },
    'en-uk': { ... },
    'en-us': { ... },
    'de': { ... },
    'fr': { ... }
  },
  rules: {
    'date': function() { ... },
    'custom': function() { ... }
  }
});

```

## Translations
```
/*
sample language file entry
{
  'home-page.greeting': 'Hello'
}
*/
var translated1 = i18n.translate('home-page.greeting');

/*
sample language file entry
{
  'home-page.greeting': 'Hello {firstName}'
}
*/
var translated2 = i18n.translate('home-page.greeting', { firstName: 'Bob' });
```

## Locales

```
var languageDefinitions = { // loaded from files
  'common': {     // 'common' is shared with every different language and is used as a fallback
    'greeting': 'Hi'
  }
  'en': {
    'greeting': 'Hello'
  },
  'de': {
    'greeting': 'Hallo'
  }
};

i18n.init({
  languages: languageDefinitions,
  locale: 'en'
});

// translate now, will work with 'en'
i18n.translate('greeting'); // returns 'Hello'

// change to 'de'
i18n.setLocale('de');
i18n.translate('greeting'); // returns 'Hallo'

// change to 'fr' (not defined in languages)
i18n.setLocale('fr'); // this will default to 'common' locale
i18n.translate('greeting'); // returns 'Hi'

```

## Rules

Rules are variable transforming functions, that takes in an object or string as a value, and the name of the variable and always returns a string.
```
function ( objectOrStringOption, nameOfVariable ) {
  return someTransformedString;
}
```

Example:
```
language file entry:
...
'animal-count-statement': 'I have {count,number} {animal,singular-plural}'
...

var rules = {
  'number': function(value, name) {
     return Math.floor(value).toString();
   },
   'singular-plural': function(obj, name) { // you can define the shape of this 'obj' according to your custom rule
      var amount = obj.number;
      var labelWhenSingular = obj.sinuglar;
      var labelWhenPlural = obj.plural;
      return amount === 1 ? labelWhenSingular : labelWhenPlural;
   }
}

// calling the translation as below,
// remember we need to provide the variables 'count' and 'animal' according to the above language file:
// 'I have {count,number} {animal,singular-plural}'

var numCats = 5;
var catArgs = {
  count: numCats,
  animal: {
    // remember the custom rule for 'singular-plural'
    number: numCats,
    singular: 'cat',
    plural: 'cats'
  }
};

var numDogs = 1;
var dogArgs = {
  count: numDogs,
  animal: {
    // remember the custom rule for 'singular-plural'
    number: numDogs,
    singular: 'dog',
    plural: 'dogs'
  }
};

i18n.translate('animal-count-statement', catArgs); // returns 'I have 5 cats'
i18n.translate('animal-count-statement', dogArgs); // returns 'I have 1 dog'

```

## Helpers

You can also use the manual rules processor (regardless of the current locale).
```
// taken from the above example of rules, you can directly call the 'process()' method
i18n.process('I have {count,number} {animal,singular-plural}', catArgs); // returns 'I have 5 cats'
i18n.process('She has {count,number} {animal,singular-plural}', dogArgs); // returns 'She has 1 dog'

```
