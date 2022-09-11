const MLRServer = require('./mlr-server.js');

const x1 = [10,20,30,20,15,25,33,34,46,50,70];
const x2 = [6,12,18,12,10,12,25,5,2,5,10];
const x3 = [1,2,2.2,2,1.5,2,2,3,3,3,3];
const y = [40,60,70,60,47,59,66,90,112,112, 139];

console.log('Data');
console.log('y:  |',y.join` | `);
console.log('x1: |',x1.join` | `);
console.log('x2: |',x2.join` | `);
console.log('\n');

const mlr = new MLRServer(y, x1, x2, x3);

mlr.getGraph(600, 300, true, true);

const xt = [10,6, 1];
console.log('y =', mlr.predict(xt));
console.log(mlr.traceSolution(xt));






