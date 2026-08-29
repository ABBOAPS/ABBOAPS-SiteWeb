import { strict as assert } from "node:assert";
import { abbiamoData, buildAbbiamoIcs } from "../src/data/abbiamo";

const ics = buildAbbiamoIcs();

assert.match(ics, /DTSTART;TZID=Europe\/Rome:20261004T140000/);
assert.match(ics, /DTEND;TZID=Europe\/Rome:20261004T190000/);
assert.match(ics, /TRIGGER:-P7DT4H/);
assert.match(ics, /TRIGGER:-P3DT4H/);
assert.match(ics, /TRIGGER:-PT4H/);
assert.equal((ics.match(/BEGIN:VALARM/g) ?? []).length, 3);
assert.equal(ics.includes(`URL:${abbiamoData.canonicalUrl}`), true);
assert.equal(ics.endsWith("END:VCALENDAR\r\n"), true);

console.log("ABBiamo calendar check: OK");
