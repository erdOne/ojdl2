const A = 65;

export function char(c) {
  return c.charCodeAt(0);
}

export function toChars(i) {
  var ret = "";
  do ret = String.fromCharCode(A + i % 26) + ret;
  while ((i = Math.floor(i / 26)));
  return ret;
}

export function fromChars(chars) {
  return chars.split("").reduce((a, c) => a * 26 + (char(c) - A), 0);
}
