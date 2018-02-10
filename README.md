# Nightwatch.js tests formatter for TeamCity
[![NPM](https://nodei.co/npm/nightwatch-teamcity.png?compact=true)](https://npmjs.org/package/nightwatch-teamcity)

TeamCity formatter for [Nightwatch.js](http://nightwatchjs.org/) end-to-end testing framework.

## Install

`npm install nightwatch-teamcity --save-dev`

## Usage

Add `--reporter node_modules/nightwatch-teamcity/index.js` to your Nightwatch run command

## Composing with other reporters

In order to compose with another reporter (e.g. nightwatch-html-reporter), you'll need to create your custom reporter and import the formatter function from this package:

```javascript
// nightwatch-reporter.js

var HtmlReporter = require("nightwatch-html-reporter");
var teamCityFormatter = require("nightwatch-teamcity").format;

var reporter = new HtmlReporter({
    reportsDirectory: "./reports",
});

module.exports = {
    write: function(results, options, done) {
        teamCityFormatter(results);
        reporter.fn(results, done);
    }
};

```

Running Nightwatch:

`$ nightwatch --reporter ./nightwatch-reporter.js`
