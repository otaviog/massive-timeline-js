// <reference path="typings/three/three.d.ts" />
/// <reference path="../src/view/timeline.ts" />
/// <reference path="../src/view/mainloop.ts" />

var camera : THREE.Camera;
var scene : THREE.Scene;
var renderer : THREE.Renderer;

function mousewheel(ev : MouseWheelEvent) {
    const delta = 0.1;
    if (ev.wheelDelta > 0) {
        camera.scale.x += delta;
        camera.scale.y += delta;
    } else {
        camera.scale.x -= delta;
        camera.scale.y -= delta;
    }
}

function init() {
    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
    let context = new MassiveTimeline.MainLoop(new THREE.Vector2(500, 600));
    let dateLine = new MassiveTimeline.TimeLine(context,
                                                new Date(2013, 0, 1), new Date(2017, 0, 1));
    scene.add(dateLine.sceneObject);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
    document.body.addEventListener('mousewheel', mousewheel, true);
}


function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

init();
animate();
