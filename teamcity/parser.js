const { Event } = require("./event")
const chunk = require("lodash/chunk")
const mapValues = require("lodash/mapValues")
const fromPairs = require("lodash/fromPairs")

function unescapeValue(value) {
    value = value.replace("|r", "\r")
    value = value.replace("|n", "\n")
    value = value.replace("|h", "\h")
    value = value.replace("|'", "'")
    value = value.replace("|\"", "\"")
    value = value.replace("||", "|")
    value = value.replace("|]", "]")

    return value
}

function parseProperties(properties) {
    const pattern = /(?:([a-z]+)=('|")((?:\|\||\|\2|[\s\S])*?)\2)+/ig
    const results = pattern.exec(properties)
    const tuples = chunk(results.slice(1), 3)

    // The groups captured by the regex contain the
    // type of quote as the second group. They must
    // be removed to allow fromPairs to work
    const keyValuePairs = tuples.map(tuple => [tuple[0], tuple[2]])

    const obj = fromPairs(keyValuePairs)

    // Here we must handle escapes present in the value
    // The TeamCity output format escapes using the
    // pipe "|" instead of the traditional slash "\"
    const cleanedObj = mapValues(obj, unescapeValue)

    return cleanedObj
}

// Every relevant line is ##teamcity[eventType key='value' key='value']
exports.parseLine = function parseLine(line) {
    const isTeamCityLine = line.startsWith("##teamcity")

    if (!isTeamCityLine) {
        return
    }

    const pattern = /^##teamcity\[([^ ]+)(.*)\]$/
    const [_, name, properties] = pattern.exec(line)

    return new Event(name, parseProperties(properties))
}
