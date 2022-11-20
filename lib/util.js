export function getBoolean(val, defaultVal) {
  if (typeof(val) === 'undefined') {
    return defaultVal;
  }
  return val;
}
