export type CalendarEvent = {
  iso: string;
  endISO: string;
  title: string;
  venue: string;
  address: string;
};
export type CoupleDetails = {
  storageKey: string;
  groomName: string;
  brideName: string;
};
const validDate = (s: string) => s.length > 0 && Number.isFinite(Date.parse(s));
export function buildCalendar(event: CalendarEvent, details: CoupleDetails) {
  const date = new Date(event.iso);
  const end =
    validDate(event.endISO) && Date.parse(event.endISO) > date.getTime()
      ? new Date(event.endISO)
      : null;
  const stamp = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  const escape = (s: string) =>
    s
      .replace(/\\/g, "\\\\")
      .replace(/\r?\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  // Fold UTF-8 lines at 75 octets, as required by RFC 5545.
  const fold = (line: string) => {
    const lines: string[] = [];
    let current = "";
    for (const char of line) {
      if (new TextEncoder().encode(current + char).length > 75) {
        lines.push(current);
        current = " " + char;
      } else current += char;
    }
    lines.push(current);
    return lines.join("\r\n");
  };
  return (
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//The Wedding Letter//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${escape(details.storageKey + "-" + event.iso)}@wedding-letter`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(date)}`,
      ...(end ? [`DTEND:${stamp(end)}`] : []),
      `SUMMARY:${escape(details.groomName + " & " + details.brideName + " — " + event.title)}`,
      `LOCATION:${escape(event.venue + ", " + event.address)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .map(fold)
      .join("\r\n") + "\r\n"
  );
}
