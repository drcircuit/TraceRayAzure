/**
 * Created by Espen on 3/28/2017.
 */
module.exports = function(vector){
    return function color(rayToTrace, world, depth) {
        var t       = 0.0;
        var closest = 12345678910110.1;
        var surface = {};
        var rec;
        if(!depth){
            depth = 0;
        }
        if (world.forEach) {
            world.forEach(function (surf) {
                var h = surf.hit(rayToTrace, 0.001, closest);
                if (h.hit) {
                    t       = h.t;
                    closest = h.t;
                    surface = surf;
                    rec     = h;
                }
            });
        } else {
            var h   = world.hit(rayToTrace, 0.001, closest);
            surface = world;
            t       = h.t;
            rec     = h;
        }
        if (t > 0.0) {
            var c = surface.material.scatter(rayToTrace, rec);
            if(c.hit && depth < 50){
                return color(c.scattered, world, depth++).multiply(c.attenuation);
            }
        }
        var unitdir = rayToTrace.direction.unitOf();
        t           = 0.5 * unitdir.y + 1.0;
        return vector(1.0, 1.0, 1.0).multiply(1.0 - t).add(vector(0.5, 0.7, 1.0).multiply(t));
    };
};