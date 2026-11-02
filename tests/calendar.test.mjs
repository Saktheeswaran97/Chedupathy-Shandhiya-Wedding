import { test } from "node:test";
import assert from "node:assert/strict";
import { buildCalendar } from "../src/lib/calendar.ts";
const couple = {
  storageKey: "chedupathy-shandhiya-2026",
  groomName: "C. Chedupathy",
  brideName: "N. Shandhiya",
};
const wedding = {
  iso: "2026-11-16T06:00:00+05:30",
  endISO: "2026-11-16T07:30:00+05:30",
  title: "The wedding",
  venue: "Thiruthani Murugan Kovil Mayil Mandapam",
  address: "Thiruthani, Tamil Nadu",
};
test("calendar preserves the actual Indian ceremony time when converted to UTC", () => {
  const ics = buildCalendar(wedding, couple);
  assert.match(ics, /DTSTART:20261116T003000Z/);
  assert.match(ics, /DTEND:20261116T020000Z/);
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
});
test("reception has its own venue, start, UID, and no invented end time", () => {
  const reception = {
    ...wedding,
    iso: "2026-11-16T19:00:00+05:30",
    endISO: "",
    title: "The reception",
    venue: "I.C.F. Thiruvalluvar Thirumana Mandapam",
    address: "Anna Nagar, Chennai – 600038",
  };
  const ics = buildCalendar(reception, couple);
  assert.match(ics, /DTSTART:20261116T133000Z/);
  assert.doesNotMatch(ics, /DTEND:/);
  assert.match(ics, /I.C.F. Thiruvalluvar/);
  assert.notEqual(
    ics.match(/UID:(.*)/)[1],
    buildCalendar(wedding, couple).match(/UID:(.*)/)[1],
  );
});
test("calendar escapes content and folds multilingual lines at 75 UTF-8 octets", () => {
  const ics = buildCalendar(
    {
      ...wedding,
      venue: "திருத்தணி முருகன் கோயில் மயில் மண்டபம் ".repeat(6),
      address: "Line one; room, two\nLine two",
    },
    couple,
  );
  for (const line of ics.split("\r\n"))
    assert.ok(Buffer.byteLength(line, "utf8") <= 75);
  const unfolded = ics.replace(/\r\n /g, "");
  assert.ok(unfolded.includes("Line one\\; room\\, two\\nLine two"));
});
