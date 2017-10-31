const { parseLine } = require("./parser")
const { Results } = require("./results")

exports.testsFromString = function testsFromString(str) {
    const lines = str.split(/\n/)
    const events = lines
        .map(line => line.trim())
        .map(parseLine)
        .filter(event => event !== undefined)

    return new Results(events)
}
