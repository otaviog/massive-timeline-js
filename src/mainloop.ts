// <reference path="typings/three/three.d.ts" />
/// <reference path="textsprite.ts" />

namespace MassiveTimeline {
    enum ControlStates {
        VIEW,
        PAN
    }

    /**
     *
     */
    export class MainLoop {
        private _renderer: THREE.Renderer;
        private _camera: THREE.OrthographicCamera;
        private _scene = new THREE.Scene();
        private _timeline: MassiveTimeline.TimeLine;

        private _currentZoom = 1;

        private _screen_space_dim: THREE.Vector2;

        /**
         * Returns the canvas dimension in pixels.
         */
        public get screen_space_dim(): THREE.Vector2 {
            return this._screen_space_dim;
        }

        /**
         * Returns the current camera's view dimension in world space.
         */
        public get camera_space_dim(): THREE.Vector2 {
            return new THREE.Vector2((this._camera.right - this._camera.left)*this._currentZoom,
                                     (this._camera.top - this._camera.bottom)*this._currentZoom);
        }

        private _state: ControlStates;

        /**
         * Returns the domElement that the timeline is being rendered.
         * Use this to insert the timeline on the webpage.
         */
        public get domElement(): HTMLCanvasElement {
            return this._renderer.domElement;
        }

        /**
         * @param screen_space_dim the canvas dimension in pixels
         * @param firstTime the starting date of the timeline
         * @param lastTime the end date of the timeline.
         */
        constructor(screen_space_dim: THREE.Vector2,
                    firstTime: Date, lastTime: Date) {
            this._screen_space_dim = screen_space_dim;
            this._state = ControlStates.VIEW;

            this._camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 1000, 1001);
            this._renderer = new THREE.WebGLRenderer();
            this._renderer.setSize(screen_space_dim.x, screen_space_dim.y);

            this._timeline = new MassiveTimeline.TimeLine(this, firstTime, lastTime);
            this._scene.translateZ(-1000);
            this._scene.add(this._timeline);
        }

        private convertMousePositionToCameraSpace(event: MouseEvent) {
            const orthoWidth = this._camera.right - this._camera.left;
            const orthoHeight = this._camera.top - this._camera.bottom;

            const x = //this._camera.position.x
            this._camera.left
                + (event.clientX / this._screen_space_dim.x) * orthoWidth;
            const y = this._camera.position.y
                + (event.clientY / this._screen_space_dim.y) * orthoHeight - this._camera.bottom;

            return new THREE.Vector2(x, y);
        }

        public render() {
            this.update();
            this._renderer.render(this._scene, this._camera);
        }

        /**
         * Handles mouse down event updating the timeline iteraction.
         * @param event mouse event from document.body.addEventListener
         */
        public mouseDown(event: MouseEvent) {
            if (event.button === THREE.MOUSE.LEFT) {
                this._state = ControlStates.PAN;
                requestAnimationFrame(() => { this.render(); });
            }
        }

        /**
         * Handles mouse up event updating the timeline iteraction.
         * @param event mouse event from document.body.addEventListener
         */
        public mouseUp(event: MouseEvent) {
            this._state = ControlStates.VIEW;
            requestAnimationFrame(() => { this.render(); });
        }

        /**
         * Handles mouse move event updating the timeline iteraction.
         * @param event mouse event from document.body.addEventListener
         */
        public mouseMove(event: MouseEvent) {
            if (this._state == ControlStates.PAN) {
                const cameraWidth = this._camera.right - this._camera.left;
                const cameraHeight = this._camera.top - this._camera.bottom;
                const xmov = (-event.movementX / this._screen_space_dim.x)*10;
                const ymov = (event.movementY / this._screen_space_dim.y)*10;
                const timelineDim = this._timeline.spaceDim;

                this._camera.position.x = THREE.Math.clamp(this._camera.position.x + xmov,
                                                          -1, timelineDim.x);
                this._camera.position.y = THREE.Math.clamp(this._camera.position.y + ymov,
                                                          -1, timelineDim.y);
                event.preventDefault();
                requestAnimationFrame(() => { this.render(); });
            }
        }

        /**
         * Handles mouse wheel event updating the timeline iteraction.
         * @param event mouse event from document.body.addEventListener
         */
        public mouseWheel(event: MouseWheelEvent) {
            const delta = 0.005;
            console.log(event.clientX);
            let mx = (event.clientX / this.domElement.width) * 2 - 1;
            let my = -(event.clientY / this.domElement.height) * 2 + 1;
            //console.log('X: ' + mx + ' Y: ' + my);

            mx = (this.camera_space_dim.x*0.5)*mx;
            my = (this.camera_space_dim.y*0.5)*my;
            //console.log('mX: ' + mx + ' mY: ' + my);

            console.log('cX: ' + this._camera.position.x + 'cY: ' + this._camera.position.y);
            if (event.wheelDelta > 0) {
                this.setZoom(this._currentZoom + delta);
            } else if (this._camera.right - this._camera.left < 100) {
                this.setZoom(this._currentZoom - delta);
            }

            const mousePos = this.convertMousePositionToCameraSpace(event)
            console.log(mousePos);
            console.log(this._camera.position);
            //this._camera.position.x -= mx;
            //this._camera.position.y -= my;

            requestAnimationFrame(() => { this.render(); });
        }

        /**
         * Sets the zoom of the timeline viewer.
         * @param value zoom value. 1 means no scale, smaller values means zoom out and bigger values means zoom in.
         */
        public setZoom(value: number) {
            console.log(value);
            if (value < 0.000005)
                return ;

            this._scene.scale.x = value*10;
            this._scene.scale.y = value*10;
            this._currentZoom = value;

            let lod = LevelOfDetail.Days;

            if (value > 2) {
                lod = LevelOfDetail.Days;
            } else if (value > 1.0) {
                lod = LevelOfDetail.Months;
            } else {
                lod = LevelOfDetail.Years;
            }

            this._timeline.setLOD(lod);
        }

        public addEvent(event: Event) {
            this._timeline.addEvent(event);
        }

        private update() {
            this._scene.traverse(function (obj) {
                if (obj instanceof MassiveTimeline.TextObject) {
                    obj.updateScale();
                }
            });
        }
    }
}
