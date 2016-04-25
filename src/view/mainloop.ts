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

        state : ControlStates;
        panMousePos : THREE.Vector2;
        panPosition : THREE.Vector2;

        constructor() {
            this.state = ControlStates.VIEW;
            this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
            this.speed = 0.1;
        }

        mouseDown(event : MouseEvent) {
            if (event.button == THREE.MOUSE.LEFT) {
                this.state = ControlStates.PAN;
                this.panMousePos = new THREE.Vector2(event.clientX, event.clientY);
                this.panPosition = new THREE.Vector2(this.camera.position.x,
                                                     this.camera.position.y);
            }
        }

        mouseUp(event : MouseEvent) {
            this.state = ControlStates.VIEW;
        }

        mouseMove(event : MouseEvent) {
            if (this.state == ControlStates.PAN) {
                const mousePos = new THREE.Vector2(event.clientX, event.clientY);

                const worldScale = new THREE.Vector2(2/908, 2/556);
                const t1 = mousePos.multiplyScalar(worldScale.x);
                const t2 = this.panMousePos.multiplyScalar(worldScale.x);

                //const diff = mousePos.sub(this.panMousePos);
                const diff = t1.sub(t2);

                const nx = this.panPosition.x - diff.x;

                this.camera.position.x = nx;
                console.log(nx);

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
