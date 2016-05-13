// <reference path="typings/three/three.d.ts" />
/// <reference path="textsprite.ts" />
/// <reference path="mainloop.ts" />
// // <reference path="typings/angular-translate/angular-translate.d.ts"/>

namespace MassiveTimeline {
    export enum LevelOfDetail {
        Days = 1,
        Weeks,
        Months,
        Years
    }


    /**
     * Draws a timeline
     */
    export class TimeLine {
        currentDate : Date;
        currentLOD : LevelOfDetail;
        sceneObject : THREE.Line;

        _yearObjects : MassiveTimeline.TextObject[] = [];
        _monthObjects : MassiveTimeline.TextObject[] = [];
        _dayObjects : MassiveTimeline.TextObject[] = [];

        daySprites : { [key:number]:TextSprite } = {};
        monthSprites : { [key:number]:TextSprite } = {};
        yearSprites : { [key:number]:TextSprite } = {};

        constructor(context : MassiveTimeline.MainLoop, firstTime : Date, lastTime : Date) {
            var material = new THREE.LineBasicMaterial({
                color: 0xffffff
            });

            firstTime = new Date(2013, 0, 1);
            lastTime = new Date(2017, 0, 1);
            material.linewidth = 2;
            var hozLineGeo = new THREE.Geometry();
            hozLineGeo.vertices.push(new THREE.Vector3(-1, 0, 0),
                                     new THREE.Vector3(1, 0, 0));

            this.sceneObject = new THREE.Line(hozLineGeo, material);

            var vertLineGeoH1 = new THREE.Geometry();
            vertLineGeoH1.vertices.push(new THREE.Vector3(0, 0, 0),
                                        new THREE.Vector3(0, 0.1, 0));
            var vertLineGeoH2 = new THREE.Geometry();
            vertLineGeoH2.vertices.push(new THREE.Vector3(0, 0, 0),
                                        new THREE.Vector3(0.0, 0.05, 0));

            var vertLineGeoH3 = new THREE.Geometry();
            vertLineGeoH3.vertices.push(new THREE.Vector3(0, 0, 0),
                                        new THREE.Vector3(0.0, 0.01, 0));

            const dayInMilliSeconds = 1000*60*60*24;
            const dateDiff = lastTime.getTime() - firstTime.getTime();
            const dayStep = 1/365;

            for (var i=1; i<=31; i++) {
                this.daySprites[i] = new MassiveTimeline.TextSprite(`${i}`, 14,
                                                                    "Times New Roman");
            }

            const months: string[] = ["January", "February", "March",
                                      "April", "May", "June", "July", "August",
                                      "September", "November", "December"];

            for (var i=1; i<=12; i++) {
                this.monthSprites[i] = new MassiveTimeline.TextSprite(
                    months[i-1], 18, "Times New Roman");
            }

            for (var i=firstTime.getFullYear(); i <= lastTime.getFullYear(); i++) {
                this.yearSprites[i] = new TextSprite(`${i}`, 24, "Times New Roman");
            }

            var nthDay = 0;
            for (var day = firstTime.getTime();
                 day <= lastTime.getTime();
                 day += dayInMilliSeconds,
                 nthDay += 1)
            {
                const dayDate = new Date(day);
                const xpos = nthDay*dayStep - 1;

                if (dayDate.getMonth() == 0 && dayDate.getDate() == 1) {
                    let lineObject = new THREE.Line(vertLineGeoH1, material);
                    lineObject.translateX(xpos);
                    this.sceneObject.add(lineObject);

                    let textInstance = this.yearSprites[dayDate.getFullYear()]
                    let textSceneObject = textInstance.createSceneObject(context);
                    textSceneObject.position.x = xpos;
                    textSceneObject.position.y = 0.11;
                    this._yearObjects.push(textSceneObject);
                    this.sceneObject.add(textSceneObject);
                } else if (dayDate.getDate() == 1) {
                    let object = new THREE.Line(vertLineGeoH2, material);
                    object.translateX(xpos);
                    this.sceneObject.add(object);

                    let sprite = this.monthSprites[dayDate.getMonth()]
                    let textSceneObject = sprite
                        .createSceneObject(context);
                    textSceneObject.scaleUpdate = function(self : MassiveTimeline.TextObject) {
                        textSceneObject.position.y = -self.width/2 - 0.01;
                    }

                    textSceneObject.position.x = xpos;
                    textSceneObject.rotateZ(Math.PI/2);
                    this._monthObjects.push(textSceneObject);
                    this.sceneObject.add(textSceneObject);

                } else {
                    let object = new THREE.Line(vertLineGeoH3, material);
                    object.translateX(xpos);
                    this.sceneObject.add(object);

                    let textSceneObject = this.daySprites[dayDate.getDate()]
                        .createSceneObject(context);
                    textSceneObject.position.x = xpos;
                    textSceneObject.position.y = -0.001;
                    this._dayObjects.push(textSceneObject);

                    this.sceneObject.add(textSceneObject);
                }
            }

            this.currentLOD = LevelOfDetail.Days;
        }

        setLOD(lod : LevelOfDetail) {
            if (this.currentLOD == lod) {
                return ;
            }
            this.currentLOD = lod;
            var monthOn : boolean;
            var dayOn : boolean;

            if (lod == LevelOfDetail.Years) {
                monthOn = false;
                dayOn = false;
            } else if (lod == LevelOfDetail.Months) {
                monthOn = true;
                dayOn = false;
            } else if (lod == LevelOfDetail.Days) {
                monthOn = true;
                dayOn = true;
            }

            for (var i = 0; i<this._monthObjects.length; i++) {
                this._monthObjects[i].visible = monthOn;
            }

            for (var i = 0; i<this._dayObjects.length; i++) {
                this._dayObjects[i].visible = dayOn;
            }
        }

        addEvent(event : Event) {
            this.sceneObject.add(new EventObject(event));
        }
    } // TimeLine
} // MassiveTimeline
