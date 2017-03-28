/**
 * Created by Espen on 3/28/2017.
 */
module.exports = function (context, req) {
    var ray = require('./ray');
    var vector = require('./vector');
    var randUnitSphere = require('./randUnit')(vector);
    var metal = require('./metalShader')(ray, randUnitSphere);
    var diffuse = require('./diffuseShader')(ray, randUnitSphere);
    var camera = require('./camera')(ray);


    function color(rayToTrace, world, depth) {
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
            //var n = rec.r.add(rec.normal).add(randUnitSphere());
            //var n = unitOfVector(ray.pointAt(t).subtract(surface.center));
            var c = surface.material.scatter(rayToTrace, rec);
            if(c.hit && depth < 50){
                return color(c.scattered, world, depth++).multiply(c.attenuation);
            }
        }
        var unitdir = rayToTrace.direction.unitOf();
        t           = 0.5 * unitdir.y + 1.0;
        return vector(1.0, 1.0, 1.0).multiply(1.0 - t).add(vector(0.5, 0.7, 1.0).multiply(t));
    }



    function sphereSurface(center, radius, material) {

        return {
            center: center,
            radius: radius,
            material: material,
            hit: function (ray, tmin, tmax) {
                var oc    = ray.origin.subtract(center);
                var a     = ray.direction.dotmul(ray.direction);
                var b     = ray.direction.dotmul(oc);
                var c     = oc.dotmul(oc) - radius * radius;
                var limit = b * b - a * c;
                if (limit < 0) {
                    return {
                        t: 0.0,
                        hit: false
                    };
                }

                var temp = (-b - Math.sqrt(limit)) / a;
                var r    = ray.pointAt(temp);
                if (temp < tmax && temp > tmin) {
                    return {
                        hit: true,
                        t: temp,
                        r: r,
                        normal: r.subtract(center).divide(radius)
                    }
                }
                temp = (-b + Math.sqrt(limit)) / a;
                r    = ray.pointAt(temp);
                if (temp < tmax && temp > tmin) {
                    return {
                        hit: true,
                        t: temp,
                        r: r,
                        normal: r.subtract(center).divide(radius)
                    }
                }
                return {
                    t: -1.0,
                    hit: false
                };
            }
        }
    }



    function createVector(vectorModel){
        context.log(vectorModel);
        return vector(vectorModel.x, vectorModel.y, vectorModel.z);
    }
    function createCamera(cameraModel){
        return camera(createVector(cameraModel.lowerCorner),createVector(cameraModel.horizontal),createVector(cameraModel.vertical),createVector(cameraModel.origin));
    }
    function createSphere(sphereModel){
        var material = diffuse(createVector(sphereModel.material.color));
        if(sphereModel.material.type == 'metal'){
            material = metal(createVector(sphereModel.material.color), sphereModel.material.options);
        }
        return sphereSurface(createVector(sphereModel.center), sphereModel.radius, material);
    }

    context.log('I really want to do some raytracing!!');

    if (req.query.traceJob || (req.body && req.body.traceJob)) {
        var traceJob =  req.query.traceJob ||req.body.traceJob;
        var camera = createCamera(traceJob.camera);
        var imageData = [];
        var samples = 10;
        function start(spheres){
            try{
                context.log('Great! You sent me a line to raytrace!!!!!: :'+traceJob.line);
                context.log("I'll perform the best traceJob of your life buddy!");
                for (var x = 0; x < traceJob.width; x++) {
                    var c = vector(0.0, 0.0, 0.0);
                    for (var s = 0; s < samples; s++) {
                        var u = (x + Math.random()) / traceJob.width;
                        var v = (traceJob.line + Math.random()) / traceJob.height;
                        var r = camera.getRay(u, v);
                        c     = c.add(color(r, spheres));
                    }
                    c                  = c.divide(samples).sqrt();
                    imageData.push(Math.floor(255 * c.x));
                    imageData.push(Math.floor(255 * c.y));
                    imageData.push(Math.floor(255 * c.z));
                    imageData.push(255);
                }
            } catch(e){
                context.log(e);
                res = {status:500, body: e};
            }
            context.log('All done!')
            context.log(imageData);
            res = {
                line:traceJob.line,
                imageData:imageData
            };
        }
        var spheres = [];
        traceJob.spheres.forEach(function(sphere){
            spheres.push(createSphere(sphere));
            if(spheres.length === traceJob.spheres.length){
                start(spheres);
            }
        });
    }
    else {
        res = {
            status: 400,
            body: "Please pass a vallid traceJob!"
        };
    }
    context.done(null, res);
};