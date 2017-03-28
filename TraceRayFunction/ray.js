/**
 * Created by Espen on 3/28/2017.
 */
module.exports = function ray(a, b) {
    return {
        origin: a,
        direction: b,
        pointAt: function (t) {
            return a.add(b.multiply(t));
        }
    }
};