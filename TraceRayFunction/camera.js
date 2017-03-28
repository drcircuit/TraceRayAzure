/**
 * Created by Espen on 3/28/2017.
 */
module.exports = function(ray){
    return function camera(lowerCorner, horizontal, vertical, origin) {
        return {
            setCorter: function (corner) {
                lowerCorner = corner;
            },
            getCorner: function () {
                return lowerCorner;
            },
            setHorizontal: function (horiz) {
                horizontal = horiz;
            },
            getHorizontal: function () {
                return horizontal;
            },
            setVertical: function (vert) {
                vertical = vert;
            },
            getVertical: function () {
                return vertical;
            },
            setOrigin: function (or) {
                origin = or;
            },
            getOrigin: function () {
                return origin;
            },
            getRay: function (u, v) {
                return ray(origin, lowerCorner.add(horizontal.multiply(u)).add(vertical.multiply(v)).subtract(origin));
            }
        }
    };
};