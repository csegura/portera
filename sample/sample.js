const portera = require('../lib/portera');

portera('http://localhost:3001', console);

//console.log('init');
//console.log('sample');

const o = {
  a: 'test',
  b: 'test2',
  c: 123,
};

try {
  throw new Error('Super Error');
} catch (err) {
  console.error(err);
}

console.assert(o.a === 'sample', 'o.a not is sample', o);

console.log(o);
console.log(process.platform);
console.log(1234);
console.info('sample', __dirname);
console.log('object', o, o);
console.warn(1, 2, 3, 4);
console.log('uno', 'dos', 'tres');
console.log('uno', 'dos', o);
console.error(null);
console.error('test');

console.trace('Test', 'we are here');

function add(a, b) {
  console.stack();
  return a + b;
}

function re_add(a, b) {
  return add(a, b);
}

add(1, 2);
re_add(55, 55);

console.assert(1 == 2, 'not the same', '1 === 2');

console.log('exit');
setTimeout(() => process.exit(), 2000);
