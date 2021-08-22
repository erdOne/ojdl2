export function formattedDate(date, shorten) {
  const yyyymmdd = date.toISOString().slice(0, 10);
  const hhmmss = date.toLocaleTimeString(undefined, { hour12: false });
  return shorten ? yyyymmdd : `${yyyymmdd} ${hhmmss}`;
}
