const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')
const Matrix = require('./matrix.js');

module.exports =  class MLRServer {
    constructor(y, ...x) {
        this.isValid(y, x);

        this.matrixY = new Matrix(y).transpose();

        // connect x's into one array.
        const newX = [];

        for (let column = 0; column < x[0].length; ++column) {
            newX[column] = [];
            newX[column][0] = 1;

            for (let row = 0; row < x.length; ++row) {
                newX[column][row + 1] = x[row][column];
            }
        }

        this.matrixX = new Matrix(newX);

        // Xtranspose
        this.tX = this.matrixX.transpose();
        // Xt * X
        this.tXX = this.tX.multiply(this.matrixX);
        // inverse Xt * X
        this.inverseTXX = this.tXX.inverse();
        // Xt * Y
        this.tXY = this.tX.multiply(this.matrixY);
        // (Xt*X)^-1 * Xt*Y
        this.matrixK = this.inverseTXX.multiply(this.tXY);

        // predict Y
        const py = [];
        for (let i = 0; i < this.matrixX.array.length; ++i) {
            const px = [];
            for (let j = 1; j < this.matrixX.array[i].length; ++j) {
                px[j-1] = this.matrixX.array[i][j];
            }
            py.push(this.predict(px));
        }
        this.matrixPredictY = new Matrix(py);

        this.predictColor = '#ff0000';
        this.realColor = '#0000ff';
        this.realRadius = 2;
        this.predictRadius = 2;
        this.realLine = 2;
        this.predictLine = 2;
    }

    isValid(y, x) {
        let arrayLength = 0;

        for (let i = 0; i < x.length; ++i) {
            let temp = arrayLength;

            if (!Array.isArray(x[i])) {
                throw new Error('X must be an array');
            }

            arrayLength = x[i].length;

            if (i !== 0 && temp !== arrayLength) {
                throw new Error('X arrays must be the same size.');
            }
        }

        if (!Array.isArray(y)) {
            throw new Error('Y must be an array');
        }

        if (arrayLength !== y.length) {
            throw new Error('The array Y must be the same size as array X.');
        }
    }

    get formula() {
        let string = `y = ${this.matrixK.array[0]}`;
        for (let i = 1; i < this.matrixK.array.length; ++i) {
            string += ` + ${this.matrixK.array[i]}*x${i}`
        }
        return string;
    }

    equation(x) {
        let y = `${this.predict(x)} = ${this.matrixK.array[0]}`;

        for (let i = 1; i < this.matrixK.array.length; ++i) {
            y += ` + ${this.matrixK.array[i]}*${x[i - 1]}`
        }

        return y;
    }

    predict(x) {
        if (x.length !== this.matrixK.array.length - 1) {
            throw new Error('Not enough X\'s.');
        }

        let y = Number(this.matrixK.array[0]);

        for (let i = 1; i < this.matrixK.array.length; ++i) {
            y += Number(this.matrixK.array[i]) * Number(x[i - 1]);
        }

        return y;
    }

    getGraph(width, height, isReal, isPredict) {
        const filename = 'graph.png';
        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');

        const scaleY = height / (Math.max(...this.matrixY.array) + 10 * this.realRadius);
        const scaleX = width / (this.matrixY.array.length + 1);

        // Draw axises
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, height);
        context.lineTo(width, height);
        context.lineWidth = 2;
        context.strokeStyle = '#000000';
        context.stroke();

        const draw = (a, context, line, radius, color) => {
            let lastY;

            for (let i = 0; i < a.length; ++i) {
                // line
                if (lastY != null && lastY != undefined) {
                    context.beginPath();
                    context.moveTo(i * scaleX, height - lastY * scaleY);
                    context.lineTo((i + 1) * scaleX, height - a[i] * scaleY);
                    context.lineWidth = line;
                    context.strokeStyle = color;
                    context.stroke();
                }

                // point
                context.beginPath();
                context.arc((i + 1) * scaleX, height - a[i] * scaleY, radius, 0, 2 * Math.PI, false);
                context.fillStyle = color;
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = color;
                context.stroke();

                lastY = a[i];
            }
        }

        if (isReal) {
            draw(this.matrixY.array, context, this.realLine, this.realRadius, this.realColor);
        }

        if (isPredict) {
            const y = [];
            draw(this.matrixPredictY, context, this.predictLine, this.predictRadius, this.predictColor);
        }

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);

        return filename;
    }
};
