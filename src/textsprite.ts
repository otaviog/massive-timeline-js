// <reference path="typings/three/three.d.ts" />
/// <reference path="mainloop.ts" />

namespace MassiveTimeline {
    export enum TextAlign {
        Center = 0,
        Left,
        Right
    }

    export class TextObject extends THREE.Mesh {
        private _width: number;
        private _height: number;
        private _tlContext: MassiveTimeline.MainLoop;
        private _canvas_dim: THREE.Vector2;
        public scaleUpdate: (self: MassiveTimeline.TextObject) => void;

        get width() {
            return this.scale.x;
        }

        constructor(
            tlContext: MassiveTimeline.MainLoop,
            geometry: THREE.PlaneGeometry,
            material: THREE.MeshBasicMaterial,
            canvas_dim: THREE.Vector2) {
            super(geometry, material);
            this._tlContext = tlContext;
            this._canvas_dim = canvas_dim;
            this.updateScale();
        }


        updateScale() {
            const screen_space_dim = this._tlContext.screen_space_dim;
            const camera_space_dim = this._tlContext.camera_space_dim;

            const width = (this._canvas_dim.x / screen_space_dim.x) * camera_space_dim.x;
            const height = (this._canvas_dim.y / screen_space_dim.y) * camera_space_dim.y;
            this.scale.x = width;
            this.scale.y = height;

            if (this.scaleUpdate) {
                this.scaleUpdate(this);
            }
        }

    }

    export class TextSprite {
        geometry: THREE.PlaneGeometry;
        material: THREE.MeshBasicMaterial;
        private _canvas_dim = new THREE.Vector2(0, 0);

        constructor(public text: string,
            public fontSizePx: number,
            public font = "Times New Roman",
            debugMode?: boolean) {
            let canvas = document.createElement("canvas");
            let context = canvas.getContext("2d");

            const fontProp = `${fontSizePx}px ${font}`;

            context.font = fontProp;
            context.textBaseline = "top";
            // context.textAlign = textAlign;
            const metrics = context.measureText(text);

            canvas = document.createElement("canvas");
            context = canvas.getContext("2d");

            canvas.width = metrics.width;
            canvas.height = fontSizePx * 1.2;

            context.font = fontProp;
            context.textBaseline = "top";
            context.fillStyle = "rgba(255, 225, 255, 1)";
            context.fillText(text, 0, 0);

            let texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            texture.minFilter = THREE.LinearFilter;
            this.material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                color: 0xffffffff
            });
            if (!debugMode)
                this.material.transparent = true;

            this.geometry = new THREE.PlaneGeometry(1, 1);
            this._canvas_dim.x = canvas.width;
            this._canvas_dim.y = canvas.height;
        }

        createSceneObject(tlContext: MassiveTimeline.MainLoop) {
            let obj = new TextObject(
                tlContext, this.geometry, this.material,
                this._canvas_dim);
            return obj;
        }

    }
}
