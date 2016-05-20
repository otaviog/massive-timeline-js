// <reference path="typings/three/three.d.ts" />
/// <reference path="../src/view/textsprite.ts" />
/// <reference path="../src/view/mainloop.ts" />

var camera: THREE.Camera;
var scene: THREE.Scene;
var renderer: THREE.Renderer;

function initText() {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

    mainloop = new MassiveTimeline.MainLoop(
        new THREE.Vector2(window.innerWidth, window.innerHeight));

    const text1 = new MassiveTimeline.TextSprite("Text one testing", 32,
        "Times New Roman", true);

    const text2 = new MassiveTimeline.TextSprite(
        "Longer text two testing -----", 32,
        "Times New Roman", true);

    const text3 = new MassiveTimeline.TextSprite(
        "Yeat Longer text two testing -----", 32,
        "Times New Roman", false);

    scene.add(text1.createSceneObject(mainloop));

    var obj = text2.createSceneObject(mainloop);
    obj.translateY(0.4);
    scene.add(obj);

    obj = text3.createSceneObject(mainloop);
    obj.translateY(-0.4);
    scene.add(obj);

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "32px Times New Roman";

    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial(
        { map: texture });
    var sprite = new THREE.Sprite(spriteMaterial);
    scene.add(sprite);
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x0000ff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
}


function animateText() {
    requestAnimationFrame(animateText);
    renderer.render(scene, camera);
}

initText();
animateText();
