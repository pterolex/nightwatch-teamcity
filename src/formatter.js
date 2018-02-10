'use strict';

const tsm = require('teamcity-service-messages');

function escapeTeamCityMessage(str) {
    if (!str) {
        return '';
    }

    return str.toString().replace(/\|/g, '||')
        .replace(/'/g, '|\'')
        .replace(/\n/g, '|n')
        .replace(/\r/g, '|r')
        .replace(/\u0085/g, '|x') // TeamCity 6
        .replace(/\u2028/g, '|l') // TeamCity 6
        .replace(/\u2029/g, '|p') // TeamCity 6
        .replace(/\[/g, '|[')
        .replace(/\]/g, '|]');
}

function formatTest(name, result) {
    const escapedTestName = escapeTeamCityMessage(name);
    const { assertions } = result;
    const time = parseFloat(result.time) * 1000;

    console.log(`##teamcity[testStarted name='${escapedTestName}' captureStandardOutput='true']`);

    assertions.forEach((assert, i) => {
        const assertText = escapeTeamCityMessage(`${assert.message} (${i})`);

        console.log(`##teamcity[testStdOut name='${escapedTestName}' out='${assertText}']`);

        if (assert.failure) {
            console.log(`##teamcity[testFailed name='${escapedTestName}' message='${assertText}' details='${escapeTeamCityMessage(`${assert.fullMsg}\n${assert.stackTrace}`)}']`);
        }
    });

    console.log(`##teamcity[testFinished name='${escapedTestName}' duration='${time}']`);
}

function formatTestSuite(name, results) {
    const { completed } = results;
    const { skipped } = results;

    tsm.testSuiteStarted({ name });

    Object.keys(completed).forEach(testName => formatTest(testName, completed[testName]));

    skipped.forEach(testName => tsm.testIgnored({ name: testName }));

    tsm.testSuiteFinished({ name });
}

function format(result, done) {
    const testSuites = result.modules;
    Object.keys(testSuites).forEach(name =>
        formatTestSuite(name, testSuites[name]));

    if (done) {
        done();
    }
}

module.exports = {
    write(result, options, done) {
        format(result, done);
    },
    format,
};
