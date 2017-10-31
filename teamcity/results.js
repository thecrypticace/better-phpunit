// There are 9 event types with certain properties
// - testCount {count}
// - testFailed {name, message, details === the stack trace}
// - testIgnored {name}
// - testSuiteStarted {name}
// - testSuiteFinished {name, duration}
// - testStarted {name}
// - testFinished {name, duration}
// - testStdOut {name, out}
// - testStdErr {name, out}

function parseEventsIntoTests(events) {
    const activeSuites = []
    let allTests = []
    let activeSuite = null
    let activeTest = null

    for (event of events) {
        if (event.name === "testSuiteStarted") {
            activeSuite = {
                name: event.properties.name,
            }

            activeSuites.push(activeSuite)
        }

        if (event.name === "testSuiteFinished") {
            activeSuite.duration = parseInt(event.properties.duration)
            activeSuites.pop()

            activeSuite = activeSuites[activeSuites.length - 1] || null
        }

        if (event.name === "testStarted") {
            activeTest = {
                suite: [].concat(activeSuites),
                name: event.properties.name,
            }

            allTests.push(activeTest)
        }

        if (event.name === "testStdOut") {
            activeTest.stdOut = event.properties.out
        }

        if (event.name === "testStdErr") {
            activeTest.stdErr = event.properties.out
        }

        if (event.name === "testFinished") {
            activeTest.status = "passed"
            activeTest.duration = parseInt(event.properties.duration)
            activeTest = null
        }

        if (event.name === "testIgnored") {
            activeTest.status = "ignored"
            activeTest.duration = parseInt(event.properties.duration)
            activeTest.message = event.properties.message || null
            activeTest.details = event.properties.details || null
            activeTest = null
        }

        if (event.name === "testFailed") {
            activeTest.status = "failed"
            activeTest.duration = parseInt(event.properties.duration)
            activeTest.message = event.properties.message || null
            activeTest.details = event.properties.details || null
            activeTest = null
        }
    }

    return allTests
}

exports.Results = function Results(events) {
    this.tests = parseEventsIntoTests(events)
}
