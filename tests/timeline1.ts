// <reference path="typings/three/three.d.ts" />
/// <reference path="../src//timeline.ts" />
/// <reference path="../src/mainloop.ts" />
/// <reference path="../src/event.ts" />

var scene: THREE.Scene;
var renderer: THREE.Renderer;
var mainloop: MassiveTimeline.MainLoop;

function initTimeline1() {
    scene = new THREE.Scene();

    mainloop = new MassiveTimeline.MainLoop(
        new THREE.Vector2(window.innerWidth, window.innerHeight));

    mainloop.timeline = new MassiveTimeline.TimeLine(
        mainloop, new Date(2013, 0, 1), new Date(2017, 0, 1));
    let event = new MassiveTimeline.Event();
    event.startDate = new Date(2014, 0, 1);
    event.endDate = new Date(2015, 3, 1);
    event.title = "Testing";
    event.color = 0xff00ff;
    mainloop.timeline.addEvent(event);
    mainloop.timeline.addEvent(new MassiveTimeline.Event(new Date(2013, 8, 12),
        new Date(2014, 6, 24),
        "Testing 2", "",
        0xff0000
    ));

    mainloop.timeline.addEvent(new MassiveTimeline.Event(
        new Date(2013, 10, 12),
        new Date(2014, 3, 24),
        "Testing 2", "",
        0x00ff00
    ));

    mainloop.scene.add(mainloop.timeline.sceneObject);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    document.body.addEventListener("mousewheel", function(ev) { mainloop.mouseWheel(ev); }, true);
    document.body.addEventListener("mousemove", function(ev) { mainloop.mouseMove(ev); }, true);
    document.body.addEventListener("mousedown", function(ev) { mainloop.mouseDown(ev); }, true);
    document.body.addEventListener("mouseup", function(ev) { mainloop.mouseUp(ev); }, true);
}

function animateTimeline1() {
    requestAnimationFrame(animateTimeline1);
    mainloop.update();
    renderer.render(mainloop.scene, mainloop.camera);
}

initTimeline1();
animateTimeline1();
