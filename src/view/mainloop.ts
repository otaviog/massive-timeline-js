// <reference path="typings/three/three.d.ts" />

namespace MassiveTimeline {
    enum ControlStates {
        VIEW,
        PAN
    }
    export class MainLoop {
        lastUpdate : number;
        speed : number;
        camera : THREE.OrthographicCamera;

        width : number;
        height : number;

        state : ControlStates;
        panMousePos : THREE.Vector2;
        panPosition : THREE.Vector2;

        constructor(width, height) {
            this.width = width;
            this.height = height;

            this.state = ControlStates.VIEW;
            this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
            this.speed = 0.1;
        }

        convertMousePositionToCameraSpace(event : MouseEvent) {
            const orthoWidth = this.camera.right - this.camera.left;
            const orthoHeight = this.camera.top - this.camera.bottom;

            const x = this.camera.position.x
                + (event.clientX/this.width)*orthoWidth - this.camera.left;
            const y = this.camera.position.y
                + (event.clientY/this.height)*orthoHeight - this.camera.bottom;

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
                const xmov = -event.movementX/this.width;
                const ymov = event.movementY/this.height;

                this.camera.position.x = THREE.Math.clamp(this.camera.position.x + xmov, -1, 1);
            }
        }

        mouseWheel(event : MouseWheelEvent) {
            const delta = 0.1;
            if (event.wheelDelta > 0) {
                this.camera.scale.x += delta;
                this.camera.scale.y += delta;
            } else {
                this.camera.scale.x -= delta;
                this.camera.scale.y -= delta;
            }

            this.camera.scale.x = Math.max(this.camera.scale.x, 0.01);
            this.camera.scale.y = Math.max(this.camera.scale.y, 0.01);
            this.camera.scale.x = Math.min(this.camera.scale.x, 10);
            this.camera.scale.y = Math.min(this.camera.scale.y, 10);
        }

        update() {
            //const now = Date.now;
            //const fps = 1000/(this.lastUpdate - now);

        }
    }
}
