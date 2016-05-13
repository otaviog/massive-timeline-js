// <reference path="typings/three/three.d.ts" />
/// <reference path="../src/view/timeline.ts" />
/// <reference path="../src/view/mainloop.ts" />
/// <reference path="../src/view/event.ts" />

var scene : THREE.Scene;
var renderer : THREE.Renderer;
var mainloop : MassiveTimeline.MainLoop;

function mousewheelScene2(ev : MouseWheelEvent) {

}

function mousemoveScene2(ev : MouseEvent) {
}

function initScene2() {
    scene = new THREE.Scene();

    console.log(window.innerWidth);
    console.log(window.innerHeight);

    mainloop = new MassiveTimeline.MainLoop(
        new THREE.Vector2(window.innerWidth, window.innerHeight));

    mainloop.timeline = new MassiveTimeline.TimeLine(
        mainloop, new Date(2013, 0, 1), new Date(2017, 0, 1));
    var event = new MassiveTimeline.Event();
    event.startDate = new Date(2014, 0, 1);
    event.endDate = new Date(2015, 3, 1);
    event.title = 'Testing';
    event.color = new THREE.Color(0xff0000);
    mainloop.timeline.addEvent(event);

    mainloop.scene.add(mainloop.timeline.sceneObject);
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
    mainloop.update();
    renderer.render(mainloop.scene, mainloop.camera);
}

initScene2();
animateScene2();
