/* global suite, test */



const expect = require('expect');

const { Results } = require('../../teamcity/results');

suite("TeamCity Results Tests", function() {
    test("Results correctly parse a stream of events", function () {
        const results = new Results([
            {name: "testSuiteStarted", properties: {name: "Feature"}},
            {name: "testSuiteStarted", properties: {name: "Tests\\Feature\\FooTest"}},

            {name: "testStarted", properties: {name: "i_pass"}},
            {name: "testFinished", properties: {name: "i_pass", duration: 60}},

            {name: "testStarted", properties: {name: "i_ignore"}},
            {name: "testIgnored", properties: {name: "i_ignore", duration: 50}},

            {name: "testStarted", properties: {name: "i_fail"}},
            {name: "testFailed", properties: {name: "i_fail", duration: 40}},

            {name: "testSuiteFinished", properties: {name: "Tests\\Feature\\FooTest", duration: 150}},
            {name: "testSuiteFinished", properties: {name: "Feature", duration: 155}},
        ])

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