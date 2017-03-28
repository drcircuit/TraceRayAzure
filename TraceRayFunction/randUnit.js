/**
 * Created by Espen on 3/28/2017.
 */
module.exports = function(vector){
    return function randUnitSphere() {
        var p = vector(Math.random(), Math.random(), Math.random()).multiply(2).subtract(vector(1.0, 1.0, 1.0));
        while (p.lengthSquared() >= 1.0) {
            p = vector(Math.random(), Math.random(), Math.random()).multiply(2).subtract(vector(1.0, 1.0, 1.0));
        }
        return p;
    };
};