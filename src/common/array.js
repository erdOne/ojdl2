/* eslint-disable no-extend-native */
Array.prototype.back = function() {
  return this[this.length - 1];
};

Array.prototype.unique = function() {
  if (!this.length) return [];
  var ret = [this[0]];
  for (var i of this)
    if (i !== ret.back())
      ret.push(i);
  return ret;
};

Array.prototype.sum = function() {
  return this.reduce((a, b)=>a + b, 0);
};

Array.init = function(len, def = 0) {
  len = Number(len);
  var ret = [];
  while (len--)ret.push(def);
  return ret;
};

Array.fromFn = function(len, fn) {
  len = Number(len);
  var ret = [];
  for (var i = 0; i < len; i++)ret.push(fn(i));
  return ret;
};

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
