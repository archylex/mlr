module.exports = class Matrix {
    constructor(array) {
        this.validation(array);

        this.size = `${this.array.length}x${this.array[0].length}`;
    }

    /**
     * Full validation of the array for compliance
     * with the requirements of the matrix.
     *
     * @param {array} array The array.
     * @return {Error} Error.
     */
    validation(array) {
        if (!Array.isArray(array)) {
            throw new Error('The value is not an array.');
        }

        if (!this.isValidTypes(array)) {
            throw new Error('The array elements of different types.');
        }

        if (!Array.isArray(array[0])) {
            array = [array];
        }

        if (!this.isOnlyNumbers(array)) {
            throw new Error('The array must contain only numbers.');
        }

        if (!this.isValidMatrix(array)) {
            throw new Error('The array must be two-dimensional.');
        }

        this.array = array;
    }

    /**
     * Matrix Validation
     *
     * @param {array} array The array.
     * @return {Boolean} result Valid matrix or not.
     */
    isValidMatrix(array) {
        let result = true;

        for (let i = 1; i < array.length; ++i) {
            result &= array[i].length === array[i-1].length;
        }

        return result;
    }

    /**
     * Element types validation.
     *
     * @param {array} array The array.
     * @return {Boolean} true or false.
     */
    isValidTypes(array) {
        for (let i = 1; i < array.length; ++i) {
            if (!(Array.isArray(array[i])) !== (!Array.isArray(array[i-1]))) {
                return false;
            }
        }

        return true;
    }

    /**
     * Checking an array to contain only numbers.
     *
     * @param {array} array The array.
     * @return {Boolean} true or false.
     */
    isOnlyNumbers(array) {
        return array.every(array_element => {
            return array_element.every(element => {
                return typeof element === 'number';
            });
        });
    }

    /**
     * Multiply two matrices.
     *
     * @param {Matrix} b The matrix B.
     * @return {Matrix} result The result of multiplying the matrix itself by b.
     */
    multiply(b) {
        if (b.constructor.name !== 'Matrix') {
            throw new Error('The parameter is not a matrix.');
        }

        if (!this.array[0].length === b.array.length) {
            throw new Error('Such matrices cannot be multiplied.');
        }

        const result = [];

        for (let row = 0; row < this.array.length; ++row) {
            result[row] = [];

            for (let bcolumn = 0; bcolumn < b.array[0].length; ++bcolumn) {
                result[row][bcolumn] = 0;

                for (let column = 0; column < this.array[0].length; ++column) {
                    result[row][bcolumn] += this.array[row][column] * b.array[column][bcolumn];
                }
            }
        }

        return new Matrix(result);
    }

    /**
     * Multiply two matrices.
     *
     * @return {Matrix} inv The result of the matrix transposition.
     */
    transpose() {
        const result = [];

        for (let column = 0; column < this.array[0].length; ++column) {
            result[column] = [];

            for (let row = 0; row < this.array.length; ++row) {
                result[column][row] = this.array[row][column];
            }
        }

        return new Matrix(result);
    }

    /**
     * Get identity matrix based on matrix itself
     *
     * @return {Matrix} result The identity matrix.
     */
    identity() {
        if (this.array.length !== this.array[0].length) {
            throw new Error('The number of rows is not equal to the number of columns.');
        }

        const result = this.transpose(this.array);

        for (let row = 0; row < result.array.length; ++row) {
            for (let column = 0; column < result.array.length; ++column) {
                result.array[row][column] = Number(row === column);
            }
        }

        return result;
    }

    /**
     * Get inverse matrix.
     *
     * @return {Matrix} result The inverse matrix.
     */
    inverse() {
        const I = this.identity(this.array);
        const N = I.array.length;
        const adj = new Array(N);
        const inv = new Array(N);

        for(let i = 0; i < N; i++) {
            adj[i] = new Array(N);
            inv[i] = new Array(N);
        }

        const getCofactor = (A, temp, p, q, n) => {
            let i = 0, j = 0;

            for (let row = 0; row < n; row++) {
                for (let col = 0; col < n; col++) {
                    if (row != p && col != q) {
                        temp[i][j++] = A[row][col];

                        if (j == n - 1) {
                            j = 0;
                            i++;
                        }
                    }
                }
            }
        }

        const determinant = (A, n) => {
            let D = 0;

            if (n == 1) {
                return A[0][0];
            }

            let temp = new Array(N);

            for(let i = 0; i < N; i++) {
                temp[i] = new Array(N);
            }

            let sign = 1;

            for (let f = 0; f < n; f++) {
                getCofactor(A, temp, 0, f, n);
                D += sign * A[0][f] * determinant(temp, n - 1);
                sign = -sign;
            }

            return D;
        }

        const adjoint = (A, adj) => {
            if (N == 1) {
                adj[0][0] = 1;
                return;
            }


            let sign = 1;
            let temp = new Array(N);

            for(let i = 0; i < N; i++) {
                temp[i] = new Array(N);
            }

            for (let i = 0; i < N; i++) {
                for (let j = 0; j < N; j++) {
                    getCofactor(A, temp, i, j, N);
                    sign = ((i + j) % 2 == 0) ? 1: -1;
                    adj[j][i] = (sign) * (determinant(temp, N - 1));
                }
            }
        }

        const det = determinant(this.array, N);

        if (det === 0) {
            throw new Error('The determinant equals zero. Singular matrix, can\'t find its inverse');
        }

        adjoint(this.array, adj);

        // Find Inverse using formula "inverse(A) = adj(A)/det(A)"
        for (let i = 0; i < N; ++i) {
            for (let j = 0; j < N; ++j) {
                inv[i][j] = adj[i][j] / det;
            }
        }

        return new Matrix(inv);
    }

    /**
     * Print the matrix to console.
     *
     * @return {string} string The formatted matrix string.
     */
    print() {
        let string = '┌─';

        for (let i = 0; i < this.array[0].length - 1; ++i) {
            string += '\t';
        }

        string += ' ─┐\n';

        for (let row = 0; row < this.array.length; ++row) {
            string += '│ ';

            for (let column = 0; column < this.array[0].length; ++column) {
                string += this.array[row][column] + '\t';
            }

            string = string.replace(/\t$/,'');
            string += ' │\n';
        }

        string += '└─';

        for (let i = 0; i < this.array[0].length - 1; ++i) {
            string += '\t';
        }

        string += ' ─┘\n';

        return string;
    }

    /**
     * Get the matrix as an HTML table.
     *
     * @return {string} string The formatted matrix string.
     */
    getHTML(mark = '') {
        let html = '<table style="border-collapse:collapse;"><tr><td style="width:15px;border-left: solid 2px black;border-top: solid 2px black;">&nbsp;</td>';

        for (let i = 0; i < this.array[0].length; ++i) {
            html +=  '<td></td>';
        }

        html += `<td style="width:15px;border-right: solid 2px black;border-top: solid 2px black;">&nbsp;</td><td>&nbsp;&nbsp;<b>${mark}</b></td></tr>`;

        for (let i = 0; i < this.array.length; ++i) {
            html += '<tr><td style="border-left: solid 2px black;">&nbsp;</td>';
            for (let j = 0; j < this.array[0].length; ++j) {
                html += `<td>&nbsp;${this.array[i][j]}&nbsp;</td>`;
            }
            html += '<td style="border-right: solid 2px black;">&nbsp;</td></tr>';
        }

        html += '<tr><td style="border-left: solid 2px black;border-bottom: solid 2px black;">&nbsp;</td>';

        for (let i = 0; i < this.array[0].length; ++i) {
            html +=  '<td></td>';
        }

        html += '<td style="border-right: solid 2px black;border-bottom: solid 2px black;">&nbsp;</td></tr></table>';

        return html;
    }
}; 
