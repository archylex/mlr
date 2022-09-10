const MLRServer = require('./mlr-server.js');

const x1 = [10,20,30,20,15,25,33,34,46,50,70];
const x2 = [6,12,18,12,10,12,25,5,2,5,10];
const y = [40,60,70,60,47,59,66,90,112,112, 139];


const mlr = new MLRServer(y, x1, x2);
mlr.getGraph(600,300, true, true);

console.log('Data');
console.log('y:  |',y.join` | `);
console.log('x1: |',x1.join` | `);
console.log('x2: |',x2.join` | `);


const xt = [10,6];
console.log ('\n');
console.log('y =', mlr.predict(xt));
console.log(mlr.traceSolution(xt));






