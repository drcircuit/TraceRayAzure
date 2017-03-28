/**
 * Created by Espen on 3/28/2017.
 */
/* A simple metal shader written by Espen */
module.exports = function(ray, randUnitSphere){
    return function (color, options){
        function reflect(v, n) {
            return v.subtract(n.multiply(v.dotmul(n)*2));
        }
        return {
            scatter: function (r, rec) {
                if(!options.fuzziness){
                    options.fuzziness = 0;
                } else if(options.fuzziness > 1){
                    options.fuzziness = 1;
                }
                var reflected =  reflect(r.direction.unitOf(), rec.normal);
                var scattered = ray(rec.r, reflected.add(randUnitSphere().multiply(options.fuzziness)));
                return {
                    scattered: scattered,
                    hit: true,
                    attenuation: color
                };
            }
        }
    };
};