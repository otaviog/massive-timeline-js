// <reference path="typings/three/three.d.ts" />

namespace MassiveTimeline {
    export class TextSprite {
        geometry : THREE.PlaneGeometry;
        material : THREE.MeshBasicMaterial;

        constructor(public text : string, public width : number) {
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');

            const fontHeight = 32;
            context.font = `${fontHeight}px Times New Roman`;
            context.textBaseline = "top";
            const metrics = context.measureText(text);


            canvas = document.createElement('canvas');
            context = canvas.getContext('2d');

            canvas.width = metrics.width;
            canvas.height = 62;

            context.font = `${fontHeight}px Times New Roman`;
            context.textBaseline = "top";
            context.fillStyle = "rgba(255, 225, 255, 1)";
            context.fillText(text, 0, 0);


            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            this.material = new THREE.MeshBasicMaterial({map: texture,
                                                        side:THREE.DoubleSide,
                                                        color: 0xffffffff } );
            this.material.transparent = true;

            const ratio = canvas.height/canvas.width;
            this.geometry = new THREE.PlaneGeometry(width, width*ratio);
        }

        createSceneObject() {
            let obj = new THREE.Mesh(this.geometry, this.material);
            return obj;
        }
    }
}
