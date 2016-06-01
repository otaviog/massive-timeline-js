// <reference path="typings/three/three.d.ts" />
/// <reference path="textsprite.ts" />
/// <reference path="mainloop.ts" />

namespace MassiveTimeline {
    /**
     * Defines the level of detail to view the timeline.
     */
    export enum LevelOfDetail {
        Days = 1, /*< Shows years, months and days*/
        Months, /*< Shows years and months and days. */
        Years /*< Shows only years. */
    }

    /**
     * Timeline main scene's object. Has the timeline drawing logic.
     */
    export class TimeLine extends THREE.Line {
        private _currentDate: Date;
        public get currentDate(): Date { return this._currentDate; }

        private _currentLOD: LevelOfDetail;
        public get currentLOD() : LevelOfDetail { return this._currentLOD; }

        private _events: EventObject[] = [];

        private _yearObjects: MassiveTimeline.TextObject[] = [];
        private _monthObjects: MassiveTimeline.TextObject[] = [];
        private _dayObjects: MassiveTimeline.TextObject[] = [];

        private _firstTime: Date;
        public get firstTime() : Date { return this._firstTime; }

        private _lastTime: Date;
        public get lastTime() : Date { return this._lastTime; }

        private _daySprites: { [key: number]: TextSprite } = {};
        private _monthSprites: { [key: number]: TextSprite } = {};
        private _yearSprites: { [key: number]: TextSprite } = {};

        /**
         * Returns the dimension (size) of the timeline in world scene units.
         */
        public get spaceDim(): THREE.Vector2 {
            const startX = this.convertDateToXPos(this._firstTime);
            const endX = this.convertDateToXPos(this._lastTime);
            return new THREE.Vector2(
                endX - startX,
                this._events.length*timespace.EventObjectHeight);
        }

        private static _createHozLineGeo(firstTime:Date, lastTime:Date) {
            let hozLineGeo = new THREE.Geometry();
            hozLineGeo.vertices.push(new THREE.Vector3(-1, 0, 0),
                                     new THREE.Vector3(
                                         timespace.measureDateSpaceDistance(firstTime, lastTime),
                                         0, 0));
            return hozLineGeo;
        }

        /**
         * Generates the timeline base geometry. Its also creates resources such canvas and cache them.
         * @param context
         */
        constructor(context: MassiveTimeline.MainLoop, firstTime: Date, lastTime: Date) {
            super(
                TimeLine._createHozLineGeo(firstTime, lastTime), new THREE.LineBasicMaterial({
                    color: 0xffffff,
                    linewidth: 2
                }));

            let material = new THREE.LineBasicMaterial({
                color: 0xffffff,
                linewidth: 2
            });


            this._firstTime = firstTime;
            this._lastTime = lastTime;

            let vertLineGeoH1 = new THREE.Geometry();
            vertLineGeoH1.vertices.push(new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0.1, 0));
            let vertLineGeoH2 = new THREE.Geometry();
            vertLineGeoH2.vertices.push(new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0.0, 0.05, 0));

            let vertLineGeoH3 = new THREE.Geometry();
            vertLineGeoH3.vertices.push(new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0.0, 0.01, 0));

            const dateDiff = lastTime.getTime() - firstTime.getTime();

            for (let i = 1; i <= 31; i++) {
                this._daySprites[i] = new MassiveTimeline.TextSprite(`${i}`, 14,
                    "Times New Roman");
            }

            const months: string[] = ["January", "February", "March",
                "April", "May", "June", "July", "August",
                "September", "November", "December"];

            for (let i = 1; i <= 12; i++) {
                this._monthSprites[i] = new MassiveTimeline.TextSprite(
                    months[i - 1], 18, "Times New Roman");
            }

            for (let i = firstTime.getFullYear(); i <= lastTime.getFullYear(); i++) {
                this._yearSprites[i] = new TextSprite(`${i}`, 24, "Times New Roman");
            }

            const dayInMilliSeconds = timespace.DayInMilliSeconds;
            const dayStep = timespace.DayLengthInSpace;
            let nthDay = 0;
            for (let day = firstTime.getTime();
                day <= lastTime.getTime();
                day += dayInMilliSeconds,
                nthDay += 1) {
                const dayDate = new Date(day);
                const xpos = nthDay * dayStep - 1;

                if (dayDate.getMonth() === 0 && dayDate.getDate() === 1) {
                    let lineObject = new THREE.Line(vertLineGeoH1, material);
                    lineObject.translateX(xpos);
                    this.add(lineObject);

                    let textInstance = this._yearSprites[dayDate.getFullYear()];
                    let textSceneObject = textInstance.createSceneObject(context);
                    textSceneObject.position.x = xpos;
                    textSceneObject.position.y = 0.11;
                    this._yearObjects.push(textSceneObject);
                    this.add(textSceneObject);
                } else if (dayDate.getDate() === 1) {
                    let object = new THREE.Line(vertLineGeoH2, material);
                    object.translateX(xpos);
                    this.add(object);

                    let sprite = this._monthSprites[dayDate.getMonth()];
                    let textSceneObject = sprite
                        .createSceneObject(context);
                    textSceneObject.scaleUpdate = function (self: MassiveTimeline.TextObject) {
                        textSceneObject.position.y = -self.width / 2 - 0.01;
                    };

                    textSceneObject.position.x = xpos;
                    textSceneObject.rotateZ(Math.PI / 2);
                    this._monthObjects.push(textSceneObject);
                    this.add(textSceneObject);

                } else {
                    let object = new THREE.Line(vertLineGeoH3, material);
                    object.translateX(xpos);
                    this.add(object);

                    let textSceneObject = this._daySprites[dayDate.getDate()]
                        .createSceneObject(context);
                    textSceneObject.position.x = xpos;
                    textSceneObject.position.y = -0.001;
                    this._dayObjects.push(textSceneObject);

                    this.add(textSceneObject);
                }
            }

            this.currentLOD = LevelOfDetail.Days;
        }

        public setLOD(lod: LevelOfDetail) {
            if (this.currentLOD === lod) {
                return;
            }
            this.currentLOD = lod;
            let monthOn: boolean;
            let dayOn: boolean;

            if (lod === LevelOfDetail.Years) {
                monthOn = false;
                dayOn = false;
            } else if (lod === LevelOfDetail.Months) {
                monthOn = true;
                dayOn = false;
            } else if (lod === LevelOfDetail.Days) {
                monthOn = true;
                dayOn = true;
            }

            for (let i = 0; i < this._monthObjects.length; i++) {
                this._monthObjects[i].visible = monthOn;
            }

            for (let i = 0; i < this._dayObjects.length; i++) {
                this._dayObjects[i].visible = dayOn;
            }
        }

        public convertDateToXPos(date: Date) {
            return timespace.measureDateSpaceDistance(this._firstTime, date);
        }

        public addEvent(event: Event) {
            let eventObj = new EventObject(event, this._events.length, this);
            this._events.push(eventObj);
            this.add(eventObj);
        }
    } // TimeLine
} // MassiveTimeline
