/* global suite, test */

const expect = require('expect');

const { testsFromString } = require('../../teamcity/teamcity');

suite("TeamCity Results Tests", function() {
    test("A string of events can be parsed", function () {
        const results = testsFromString(`
            ##teamcity[testSuiteStarted name='Feature']
            ##teamcity[testSuiteStarted name='Tests\\Feature\\FooTest']
            ##teamcity[testStarted name='i_pass']
            ##teamcity[testFinished name='i_pass' duration='60']
            ##teamcity[testStarted name='i_ignore']
            ##teamcity[testIgnored name='i_ignore' duration='50']
            ##teamcity[testStarted name='i_fail']
            ##teamcity[testFailed name='i_fail' duration='40']
            ##teamcity[testSuiteFinished name='Tests\\Feature\\FooTest' duration='150']
            ##teamcity[testSuiteFinished name='Feature' duration='155']
        `)

        expect(results.tests).toEqual([
            {
                duration: 60,
                name: "i_pass",
                status: "passed",
                suite: [
                    {
                        name: "Feature",
                        duration: 155,
                    },
                    {
                        name: "Tests\\Feature\\FooTest",
                        duration: 150,
                    },
                ],
            },
            {
                duration: 50,
                name: "i_ignore",
                status: "ignored",
                details: null,
                message: null,
                suite: [
                    {
                        name: "Feature",
                        duration: 155,
                    },
                    {
                        name: "Tests\\Feature\\FooTest",
                        duration: 150,
                    },
                ],
            },
            {
                duration: 40,
                name: "i_fail",
                status: "failed",
                details: null,
                message: null,
                suite: [
                    {
                        name: "Feature",
                        duration: 155,
                    },
                    {
                        name: "Tests\\Feature\\FooTest",
                        duration: 150,
                    },
                ],
            },
        ]);
    });
});