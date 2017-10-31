/* global suite, test */

const expect = require('expect');

const { parseLine } = require('../../teamcity/parser');

suite("TeamCity Parser Tests", function() {
    test("Non TeamCity lines are not parsed", function () {
        expect(parseLine("foo")).toBe(undefined)
    });

    test("lines can be parsed", function () {
        const event = parseLine("##teamcity[someEvent key='value']")

        expect(event.name).toBe("someEvent");
        expect(event.properties.key).toBe("value");
    });
    
    test("lines handle escaped new lines", function () {
        const event = parseLine("##teamcity[someEvent key='value1|nvalue2']")

        expect(event.name).toBe("someEvent");
        expect(event.properties.key).toBe("value1\nvalue2",);
    });

    test("lines handle escaped bars", function () {
        const event = parseLine("##teamcity[someEvent key='value1|nvalue2|]']")

        expect(event.name).toBe("someEvent");
        expect(event.properties.key).toBe("value1\nvalue2]");
    });

    test("lines handle escaped quotes", function () {
        const event = parseLine("##teamcity[someEvent key='value1|nvalue2|'']")

        expect(event.name).toBe("someEvent");
        expect(event.properties.key).toBe("value1\nvalue2'");
    });

    test("lines can extract multiple key/value pairs", function () {
        const event = parseLine("##teamcity[someEvent key1='value1' key2='value2']")

        expect(event.name).toBe("someEvent", );
        expect(event.properties.key1).toBe("value1");
        expect(event.properties.key2).toBe("value2");
    });
});