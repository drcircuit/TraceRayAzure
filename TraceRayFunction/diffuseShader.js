/**
 * Created by Espen on 3/28/2017.
 */
/* A simple diffuse shader written by Espen */
module.exports = function(ray, randUnitSphere){
    return function (color){
        return {
            scatter: function (r, rec) {
                var target =  rec.r.add(rec.normal).add(randUnitSphere());
                return {
                    scattered: ray(rec.r, target.subtract(rec.r)),
                    hit: true,
                    attenuation: color
                };
            }
        }
    };
};