// <reference path="typings/three/three.d.ts" />

namespace MassiveTimeline {
    export class TextSprite {
        sceneObject : THREE.Mesh;

        constructor(public text : string, public width : number) {
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');

            const fontHeight = 52;
            context.font = `Bold ${fontHeight}px Arial`;
            context.textBaseline = "top";
            const metrics = context.measureText(text);


            canvas = document.createElement('canvas');
            context = canvas.getContext('2d');

            canvas.width = metrics.width;
            canvas.height = 62;

            context.font = `Bold ${fontHeight}px Arial`;
            context.textBaseline = "top";
            context.fillStyle = "rgba(255, 225, 255, 1)";
            context.fillText(text, 0, 0);


            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            var material = new THREE.MeshBasicMaterial({map: texture,
                                                        side:THREE.DoubleSide,
                                                        color: 0xffffffff } );
            material.transparent = true;

            const ratio = canvas.height/canvas.width;
            var geometry = new THREE.PlaneGeometry(width, width*ratio);
            this.sceneObject = new THREE.Mesh(geometry, material);
        }
    }
}
