// <reference path="typings/three/three.d.ts" />
/// <reference path="../src/view/timeline.ts" />
/// <reference path="../src/view/mainloop.ts" />

var scene : THREE.Scene;
var renderer : THREE.Renderer;
var mainloop : MassiveTimeline.MainLoop;

function mousewheelScene2(ev : MouseWheelEvent) {

}

function mousemoveScene2(ev : MouseEvent) {
}

function initScene2() {
    scene = new THREE.Scene();

    mainloop = new MassiveTimeline.MainLoop(window.innerWidth, window.innerHeight);
    let dateLine = new MassiveTimeline.TimeLine(new Date(2013, 0, 1), new Date(2017, 0, 1));
    scene.add(dateLine.sceneObject);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
    document.body.addEventListener('mousewheel', function(ev) { mainloop.mouseWheel(ev); }, true);
    document.body.addEventListener('mousemove', function(ev) {mainloop.mouseMove(ev); }, true);
    document.body.addEventListener('mousedown', function(ev) {mainloop.mouseDown(ev); }, true);
    document.body.addEventListener('mouseup', function(ev) {mainloop.mouseUp(ev); }, true);
}


function animateScene2() {
    requestAnimationFrame( animateScene2 );
    renderer.render( scene, mainloop.camera );
}

initScene2();
animateScene2();
