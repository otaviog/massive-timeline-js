// <reference path="typings/three/three.d.ts" />

namespace MassiveTimeline {
    class TextSprite {
        sceneObject : THREE.Mesh;

        constructor(public text : string, public width : number) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            context.textBaseline = "top";
            context.font = "Bold 50px Arial";
            context.fillStyle = "rgba(255, 225, 255, 1)";
            context.fillText(text, 0, 0);

            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            var material = new THREE.MeshBasicMaterial({map: texture,
                                                        side:THREE.DoubleSide,
                                                        color: 0xffffffff } );
            //material.transparent = true;

            width = 0.5;
            let ratio = canvas.height/canvas.width;
            var geometry = new THREE.PlaneGeometry(width, width*ratio);
            this.sceneObject = new THREE.Mesh(geometry, material);
        }
    }
}
