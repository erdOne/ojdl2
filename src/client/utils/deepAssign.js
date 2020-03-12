export default function deepAssign(obj, prop) {
  if (obj instanceof Object && prop instanceof Object) {
    var retObj = {};
    for (let i in obj) retObj[i] = obj[i];
    for (let i in prop) retObj[i] = deepAssign(obj[i], prop[i]);
    return retObj;
  } else
    return prop;

}
