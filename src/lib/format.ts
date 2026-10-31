const dateTime = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

/** "Oct 30, 2026, 2:02 PM" in the reader's time zone. */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));
