/* global suite, test */

const expect = require('expect');

const { parseLine } = require('../../teamcity/parser');

suite("TeamCity Parser Tests", function() {
    test("Non TeamCity lines are not parsed", function () {
        expect(parseLine("foo")).toBe(undefined)
    });

    test("Team City lines can be parsed", function () {
        const event = parseLine("##teamcity[someEvent key='value']")

        expect(event.name).toBe("someEvent");
        expect(event.properties.key).toBe("value");
    });
    
    test("Team City lines handle escaped new lines", function () {
        const event = parseLine("##teamcity[someEvent key='value1|nvalue2']")

        expect(event.name).toBe("someEvent", );
        expect(event.properties.key).toBe("value1\nvalue2",);
    });

    test("Team City lines handle escaped bars", function () {
        const event = parseLine("##teamcity[someEvent key='value1|nvalue2|]']")

        expect(event.name).toBe("someEvent", );
        expect(event.properties.key).toBe("value1\nvalue2]");
    });

    test("Team City lines handle escaped quotes", function () {
        const event = parseLine("##teamcity[someEvent key='value1|nvalue2|'']")

        expect(event.name).toBe("someEvent");
        expect(event.properties.key).toBe("value1\nvalue2'");
    });
});