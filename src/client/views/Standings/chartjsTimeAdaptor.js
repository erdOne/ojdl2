import { _adapters } from "chart.js";

var FORMATS = {
  datetime: "MMM D, YYYY, h:mm:ss a",
  millisecond: "h:mm:ss.SSS a",
  second: "h:mm:ss a",
  minute: "h:mm a",
  hour: "ha",
  day: "MMM D",
  week: "DD",
  month: "MMM YYYY",
  quarter: "[Q]Q - YYYY",
  year: "YYYY"
};

const SECONDS = 1000,
  MINUTES = SECONDS * 60,
  HOURS = MINUTES * 60,
  DAYS = HOURS * 24,
  UNITS = {
    millisecond: 1,
    second: SECONDS,
    minute: MINUTES,
    hour: HOURS,
    day: DAYS
  };

function pad(x) {
  x = "" + Math.floor(x);
  if (x.length < 2)x = "0" + x;
  return x;
}

/* eslint-disable no-underscore-dangle, max-len */
_adapters._date.override({
  _id: "date-fns", // DEBUG

  formats: function() {
    return FORMATS;
  },

  parse: function(value) {
    return parseInt(value) ?? null;
  },

  format: function(time, fmt) {
    if (time >= DAYS)
      return `${Math.floor(time / DAYS)} ${pad(time % DAYS / HOURS)}:${pad(time % HOURS / MINUTES)}:${pad(time % MINUTES / SECONDS)}`;
    if (time >= HOURS)
      return `${Math.floor(time / HOURS)}:${pad(time % HOURS / MINUTES)}:${pad(time % MINUTES / SECONDS)}`;
    if (time >= MINUTES)
      return `${Math.floor(time / MINUTES)}:${pad(time % MINUTES / SECONDS)}`;
    if (time >= SECONDS)
      return "" + Math.floor(time / SECONDS);
    return "" + time;
  },

  add: function(time, amount, unit) {
    unit = UNITS[unit] || 0;
    return time + amount * unit;
  },

  diff: function(max, min, unit) {
    unit = UNITS[unit];
    if (unit) return Math.floor((max - min) / unit);
    return 0;
  },

  startOf: function(time, unit, weekday) {
    unit = UNITS[unit] || 1;
    return time - time % unit;
  },

  endOf: function(time, unit) {
    unit = UNITS[unit] || 1;
    return time - time % unit + unit - 1;
  }
});
