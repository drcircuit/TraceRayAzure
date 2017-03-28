/**
 * Created by Espen on 3/28/2017.
 */
(function(){
    function createPrompt() {
        var prompt = document.createElement('h1');
        prompt.id = 'status';
        prompt.innerText = 'Raytracing using Azure Functions!';

        return prompt;
    }
    function createCanvas(w, h) {
        var c = document.getElementsByTagName('canvas')[0] || document.createElement('canvas');
        c.width = w;
        c.height = h;
        c.id = 'screen';
        return c;
    }


    function buildScreen(w, h) {
        var body = document.getElementsByTagName("body")[0];
        var c = createCanvas(w, h);
        body.appendChild(c);
        body.appendChild(createPrompt());

        return {
            canvas: c,
            ctx: c.getContext('2d'),
            width: w,
            height: h
        };
    }

    function sendAzureRayTraceRequest(traceRayUrl, traceJob, renderLine) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var rayTracedLine = JSON.parse(this.responseText);
                renderLine(rayTracedLine.line, rayTracedLine.imageData);

            }
        };
        xhttp.open('POST', traceRayUrl, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({traceJob: traceJob}));
        return xhttp;
    }
    function writeStatus(msg) {
        var status = document.getElementById('status');
        status.innerText = msg;
    }
    var rendered;
    function main() {

        var traceRayUrl = "https://traceray.azurewebsites.net/api/TraceRay";
        var world = buildScreen(720, 360);
        var camera = {
            lowerCorner: {
                x: -2.0,
                y: -1.0,
                z: -1.0
            },
            horizontal: {
                x: 4.0,
                y: 0.0,
                z: 0.0
            },
            vertical: {
                x: 0.0,
                y: 2.0,
                z: 0.0
            },
            origin: {
                x: 0.0,
                y: 0.0,
                z: 0.0
            }
        };
        var spheres = [{
            center: {
                x: 0.0,
                y: 0.0,
                z: -1.0
            },
            material: {
                type: 'metal',
                color: {
                    x: 1.0,
                    y: 0.3,
                    z: 0.7
                },
                options: {
                    fuzziness: 0.3
                }
            },
            radius: 0.5
        }, {
            center: {
                x: 1.0,
                y: 0.0,
                z: -1.0
            },
            material: {
                type: 'metal',
                color: {
                    x: 0.5,
                    y: 0.6,
                    z: 1.0
                },
                options: {
                    fuzziness: 0.0
                }
            },
            radius: 0.5
        }, {
            center: {
                x: 0.0,
                y: -100.5,
                z: -1.0
            },
            radius: 100,
            material: {
                type: 'diffuse',
                color: {
                    x: 0.0,
                    y: 1.0,
                    z: 0.7
                },
                options: {
                    fuzziness: 0.4
                }
            }
        }];

        function displayRenderedData(line, data) {
            var lineImage = world.ctx.createImageData(world.width, 1);
            var lineBuffer = new Uint8ClampedArray(world.width * 4);
            var total = world.width * 4;
            for (var i = 0; i < total; i++) {
                lineBuffer[i] = data[i];
            }
            lineImage.data.set(lineBuffer);
            world.ctx.putImageData(lineImage, 0, world.height - line);
            writeStatus('Rendered ' + ++rendered + ' of ' + world.height + ' lines...');
        }

        writeStatus("Starting rendering using Azure Functions");
        rendered = 0;
        for (var y = world.height - 1; y >= 0; y--) {
            var traceJob = {
                camera: camera,
                spheres: spheres,
                width: world.width,
                height: world.height,
                line: y
            };
            sendAzureRayTraceRequest(traceRayUrl, traceJob, displayRenderedData);
        }
    }
    main();
}());