const MLRServer = require('./mlr-server.js');

const x1 = [10,20,30,20,15,25,33,34,46,50,70];
const x2 = [6,12,18,12,10,12,25,5,2,5,10];
const y = [40,60,70,60,47,59,66,90,112,112, 139];


const mlr = new MLRServer(y, x1, x2);
mlr.getGraph(600,300,true, true);

console.log('Data');
console.log('y:  |',y.join` | `);
console.log('x1: |',x1.join` | `);
console.log('x2: |',x2.join` | `);

console.log('\n\nMatrices');
console.log('Y = ');
console.log(mlr.matrixY.print());
const htmlY = mlr.matrixY.getHTML();

console.log('X = ');
console.log(mlr.matrixX.print());
const htmlX = mlr.matrixY.getHTML();

console.log('transpose X = ');
console.log(mlr.tX.print());
const htmlTX = mlr.tX.getHTML();

console.log('X^T X');
console.log(mlr.tXX.print());
const htmlTXX = mlr.tXX.getHTML();

console.log('(X^T X)^-1 [inverse matrix]');
console.log(mlr.inverseTXX.print());
const htmlInverseTXX = mlr.inverseTXX.getHTML();

console.log('X^T Y');
console.log(mlr.tXY.print());
const htmlTXY = mlr.tXY.getHTML();

console.log('B = (X^T X)^-1 (X^T Y)');
console.log('K');
console.log(mlr.matrixK.print());
const htmlK = mlr.matrixK.getHTML();

console.log('Predict Y (Y\')');
console.log(mlr.matrixPredictY.print());
const htmlPredictY = mlr.matrixPredictY.getHTML();

console.log ('formula with coefs:');
console.log(mlr.formula);

const xt = [1,2];
console.log ('\n');
console.log('equation: ',mlr.equation(xt));
console.log('y =', mlr.predict(xt));





