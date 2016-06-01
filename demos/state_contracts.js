// <reference path="typings/three/three.d.ts" />
/// <reference path="../src/timeline.ts" />
/// <reference path="../src/mainloop.ts" />
/// <reference path="../src/event.ts" />
var mainloop;
function initTimeline() {
    var width = 768;
    var height = 768;
    mainloop = new MassiveTimeline.MainLoop(new THREE.Vector2(width, height), new Date(2009, 6, 1), new Date(2017, 0, 1));
    var container = document.getElementById('canvas');
    document.body.appendChild(mainloop.domElement);
    document.body.addEventListener("mousewheel", function (ev) {
        mainloop.mouseWheel(ev);
        ev.preventDefault();
        return false;
    }, true);
    document.body.addEventListener("mousemove", function (ev) {
        mainloop.mouseMove(ev);
    }, true);
    document.body.addEventListener("mousedown", function (ev) {
        mainloop.mouseDown(ev);
        return false;
    }, true);
    document.body.addEventListener("mouseup", function (ev) {
        mainloop.mouseUp(ev);
        return false;
    }, true);
    // contractData is defined in assets/contracts.js
    for (var i = 0; i < contractData.length; ++i) {
        var obj = contractData[i];
        mainloop.addEvent(new MassiveTimeline.Event(new Date(obj.startDate), new Date(obj.endDate), obj.title, obj.description, obj.color));
    }
    mainloop.render();
}
initTimeline();
//animateTimeline();
//# sourceMappingURL=state_contracts.js.map