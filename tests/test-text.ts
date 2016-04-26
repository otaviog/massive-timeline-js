// <reference path="typings/three/three.d.ts" />
/// <reference path="../src/view/textsprite.ts" />

var camera : THREE.Camera;
var scene : THREE.Scene;
var renderer : THREE.Renderer;

function initText() {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

    const text = new MassiveTimeline.TextSprite("Text one testing", 0.5);

    scene.add(new THREE.Mesh(text.geometry, text.material));

    renderer = new THREE.WebGLRenderer();
    //renderer.setClearColor(0x0000ff);
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
}


function animateText() {
    requestAnimationFrame( animateText );
    renderer.render( scene, camera );
}

initText();
animateText();
