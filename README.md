# Simple I18n [![npm version](https://badge.fury.io/js/%40pureartisan%2Fsimple-i18n.svg)](https://badge.fury.io/js/%40pureartisan%2Fsimple-i18n) [![CircleCI](https://circleci.com/gh/pureartisan/simple-i18n.svg?style=svg)](https://circleci.com/gh/pureartisan/simple-i18n)

Simple and light weight i18n library.

## Installation
```
npm install @prageeths/simple-i18n
```

### HTML tags in your translations

If you want to use HTML tags in your translations safely (without opening your application into XSS), you have to use a proper technic to parse the tags in the translation file.

You can use one of the plugins for "Simple I18n" below. Depending on the framework being used:
* React: plugin [`@prageeths/simple-i18n-react`](https://github.com/prageeth/simple-i18n-react)
* Angular: plugin coming soon...
* Vue: plugin coming soon...

***NOTE***
The above plugins are required ONLY if you want to use HTML tags in the translation files, otherwise you can simple use this module without your React/Angular/Vue projects.

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

### Easy syntax

```
// ES5
var i18n = require('@prageeths/simple-i18n');
var translate = i18n.translate;

// ES6
import { translate } from '@prageeths/simple-i18n';

...

translate('greeting');

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

## Locale dependant rules

We may sometimes need rules dependent on locale, such as different date formats

```
import moment from 'moment';

...

var languageDefinitions = {
  'common': {
    'greeting.today': 'Hi, today is {today,date}' // 'today' is the variable name, 'date' is the rule name
  },
  'en': {
    'date-format': 'DD-MM-YYYY'
  },
  'de': {
    'date-format': 'DD.MM.YYYY'
  }
};

var rules = {
  'date': function(value, name) {
     var dateFormat = i18n.raw('date-format'); // this will be resolved using the current locale
     return moment(value).format(dateFormat);
   }
}

i18n.init({
  languages: languageDefinitions,
  locale: 'en',
  rules: rules
});

...

// current locale is 'en'
i18n.translate('greeting.today', { today: new Date() }); // returns 'Hi, today is 12-11-2018'

// change to 'de'
i18n.setLocale('de');
i18n.translate('greeting.today'); // returns 'Hi, today is 12.11.2018'
```

## Helpers

### i18n.setLocale(locale)

You can override the locale using `setLocal()` method.

```
// locale; e.g. 'en', 'en-uk', 'de', 'fr'
function onUserChooseLanguage(locale) {
   i18n.setLocale(lanugage);
}
```

### i18n.raw(i18nKey)

You can access the raw/unprocessed i18n translation, that will return a raw string (variables will not be replaced).

```
var languageDefinitions = {
  'common': {
    'greeting.today': 'Hi, today is {today,date}'
  }
}

...

i18n.raw(i18nKey); // returns 'Hi, today is {today,date}'
```

### i18n.process(i18nKey, i18nOptions)

You can also use the manual rules processor (regardless of the current locale).
```
// taken from the above example of rules, you can directly call the 'process()' method
i18n.process('I have {count,number} {animal,singular-plural}', catArgs); // returns 'I have 5 cats'
i18n.process('She has {count,number} {animal,singular-plural}', dogArgs); // returns 'She has 1 dog'
```
