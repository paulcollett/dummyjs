const rand = (min, max) => {
  if(!min || !max) return min;
  min = Math.floor(min);
  max = Math.floor(max) + 1;
  return Math.floor(Math.random() * (max - min)) + min;
};

// repeat polyfill
const repeat = (str, count) => {
  return ''.repeat ? ('' + str).repeat(count) : ((str, count, rpt) => {
    for (let i = 0; i < count; i++) rpt += str;

    return rpt;
  })(str + '', Math.floor(count), '');
};

export default {rand, repeat}
