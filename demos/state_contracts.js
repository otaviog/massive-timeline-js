// <reference path="typings/three/three.d.ts" />
/// <reference path="../src/timeline.ts" />
/// <reference path="../src/mainloop.ts" />
/// <reference path="../src/event.ts" />
var scene;
var renderer;
var mainloop;
function initTimeline() {
    scene = new THREE.Scene();
    var width = 768;
    var height = 768;
    mainloop = new MassiveTimeline.MainLoop(new THREE.Vector2(width, height));
    mainloop.timeline = new MassiveTimeline.TimeLine(mainloop, new Date(2009, 6, 1), new Date(2017, 0, 1));
    mainloop.scene.add(mainloop.timeline.sceneObject);
    var container = document.getElementById('canvas');
    document.body.appendChild(container);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    document.body.appendChild(renderer.domElement);
    document.body.addEventListener("mousewheel", function (ev) { mainloop.mouseWheel(ev); }, true);
    document.body.addEventListener("mousemove", function (ev) { mainloop.mouseMove(ev); }, true);
    document.body.addEventListener("mousedown", function (ev) { mainloop.mouseDown(ev); }, true);
    document.body.addEventListener("mouseup", function (ev) { mainloop.mouseUp(ev); }, true);
    // contractData is defined in assets/contracts.js
    for (var i = 0; i < contractData.length; ++i) {
        var obj = contractData[i];
        mainloop.timeline.addEvent(new MassiveTimeline.Event(new Date(obj.startDate), new Date(obj.endDate), obj.title, obj.description, obj.color));
    }
}
function animateTimeline() {
    requestAnimationFrame(animateTimeline);
    mainloop.update();
    renderer.render(mainloop.scene, mainloop.camera);
}
initTimeline();
animateTimeline();
//# sourceMappingURL=state_contracts.js.map