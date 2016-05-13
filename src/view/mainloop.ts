// <reference path="typings/three/three.d.ts" />
/// <reference path="textsprite.ts" />

namespace MassiveTimeline {
    enum ControlStates {
        VIEW,
        PAN
    }

    export class MainLoop {
        lastUpdate : number;
        speed : number;
        camera : THREE.OrthographicCamera;
        scene = new THREE.Scene();
        timeline : MassiveTimeline.TimeLine;

        private _currentZoom = 1;

        _screen_space_dim : THREE.Vector2;
        get screen_space_dim() : THREE.Vector2 {
            return this._screen_space_dim;
        }

        get camera_space_dim() : THREE.Vector2 {
            return new THREE.Vector2(this.camera.right - this.camera.left,
                                     this.camera.top - this.camera.bottom);
        }

        state : ControlStates;
        panMousePos : THREE.Vector2;
        panPosition : THREE.Vector2;

        constructor(screen_space_dim : THREE.Vector2) {
            this._screen_space_dim = screen_space_dim;

            this.state = ControlStates.VIEW;
            //this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
            this.camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1, 1);
            this.speed = 0.1;
        }

        convertMousePositionToCameraSpace(event : MouseEvent) {
            const orthoWidth = this.camera.right - this.camera.left;
            const orthoHeight = this.camera.top - this.camera.bottom;

            const x = this.camera.position.x
                + (event.clientX/this._screen_space_dim.x)*orthoWidth - this.camera.left;
            const y = this.camera.position.y
                + (event.clientY/this._screen_space_dim.y)*orthoHeight - this.camera.bottom;

            return new THREE.Vector2(x, y)
        }

        mouseDown(event : MouseEvent) {
            if (event.button == THREE.MOUSE.LEFT) {
                this.state = ControlStates.PAN;
                this.panMousePos = this.convertMousePositionToCameraSpace(event);
                this.panPosition = new THREE.Vector2(this.camera.position.x,
                                                     this.camera.position.y);
            }
        }

        mouseUp(event : MouseEvent) {
            this.state = ControlStates.VIEW;
        }

        mouseMove(event : MouseEvent) {
            if (this.state == ControlStates.PAN) {
                const xmov = -event.movementX/this._screen_space_dim.x;
                const ymov = event.movementY/this._screen_space_dim.y;

                this.camera.position.x = THREE.Math.clamp(this.camera.position.x + xmov, -1, 5);
                this.camera.position.y = THREE.Math.clamp(this.camera.position.y + ymov, -1, 1);
            }
        }

        mouseWheel(event : MouseWheelEvent) {
            const delta = 0.05;
            if (event.wheelDelta > 0) {
                this.setZoom(this._currentZoom + delta);
            } else if (this.camera.right - this.camera.left < 10) {
                this.setZoom(this._currentZoom - delta);
            }
        }

        setZoom(value: number) {
            if (value < 0.05 || value > 1.98) {
                return ;
            }
            this._currentZoom = value;

            if (value > 1) {
                const delta = value - 1;
                this.camera.left = -1 + delta;
                this.camera.right = 1 - delta;
                this.camera.top = 1 - delta;
                this.camera.bottom = -1 + delta;
            } else if (value < 1) {
                const delta = 1 - value;
                this.camera.left = -1 - delta;
                this.camera.right = 1 + delta;
                this.camera.top = 1 + delta;
                this.camera.bottom = -1 - delta;
            } else {
                this.camera.left = -1;
                this.camera.right = 1;
                this.camera.bottom = -1;
                this.camera.top = 1;
            }
            this.camera.updateProjectionMatrix();

            var lod = LevelOfDetail.Days;

            if (value > 1.9) {
                lod = LevelOfDetail.Days;
            } else if (value > 1.0) {
                lod = LevelOfDetail.Months;
            } else {
                lod = LevelOfDetail.Years;
            }

            console.log(value);
            this.timeline.setLOD(lod);
        }

        update() {
            this.scene.traverse(function(obj) {
                if (obj instanceof MassiveTimeline.TextObject) {
                    obj.updateScale();

                }
            });

        }
    }
}
