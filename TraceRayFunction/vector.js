/**
 * Created by Espen on 3/28/2017.
 */
/* 3d vector object to do 3d vector math. Written by Espen */
module.exports = function vector(e0, e1, e2) {
    function length(){
        return Math.sqrt(e0 * e0 + e1 * e1 + e2 * e2);
    }
    function numericDivide(n){
        return vector(e0 / n, e1 / n, e2 / n);
    }
    return {
        x: e0,
        y: e1,
        z: e2,
        unitOf:function(){
            return numericDivide(length());
        },
        add: function (vec) {
            if (isNaN(vec)) {
                return vector(e0 + vec.x, e1 + vec.y, e2 + vec.z);
            } else {
                return vector(e0 + vec, e1 + vec, e2 + vec);
            }
        },
        subtract: function (vec) {
            if (isNaN(vec)) {
                return vector(e0 - vec.x, e1 - vec.y, e2 - vec.z);
            } else {
                return vector(e0 - vec, e1 - vec, e2 - vec);
            }
        },
        multiply: function (vec) {
            if (isNaN(vec)) {
                return vector(e0 * vec.x, e1 * vec.y, e2 * vec.z);
            } else {
                return vector(e0 * vec, e1 * vec, e2 * vec);
            }
        },
        xmul: function (vec) {
            return vector(e1 * vec.z - e2 * vec.y, -(e0 * vec.z - e2 * vec.x), e0 * vec.y - e1 * vec.x)
        },
        dotmul: function (vec) {
            return e0 * vec.x + e1 * vec.y + e2 * vec.z;
        },
        divide: function (vec) {
            if (isNaN(vec)) {
                return vector(e0 / vec.x, e1 / vec.y, e2 / vec.z);
            } else {
                return numericDivide(vec);
            }
        },
        sqrt: function () {
            return vector(Math.sqrt(e0), Math.sqrt(e1), Math.sqrt(e2));
        },
        invert: function () {
            return vector(-e0, -e1, -e2);
        },
        length: function () {
            return length();
        },
        lengthSquared: function () {
            return e0 * e0 + e1 * e1 + e2 * e2;
        }
    };
};