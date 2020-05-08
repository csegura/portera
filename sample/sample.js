const portera = require('../lib/portera');

portera('http://localhost:3001', console);

console.log('init');
console.log('sample');

const o = {
  a: 'test',
  b: 'test2',
  c: 123,
};

console.log(o);
console.log(process.env);
console.log(process.eventNames);
console.log(1234);
console.info('demo', __dirname);
console.log('object', o, o);
console.warn(1, 2, 3, 4);
console.log('uno', 'dos', 'tres');
console.log('uno', 'dos', o);
console.error(null);
console.error('test');

console.trace('Test', 'test 2');

function add(a, b) {
  console.stack();
  return a + b;
}

function readd(a, b) {
  return add(a, b);
}

add(1, 2);
add(99, 99);
readd(55, 55);

try {
  throw new Error('Super Error');
} catch (err) {
  console.log(err);
  console.error(err);
}

console.log('exit');
setTimeout(() => process.exit(), 2000);
