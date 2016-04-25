// <reference path="typings/three/three.d.ts" />

namespace MassiveTimeline {
    enum LevelOfDetail {
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
        viewDetail : LevelOfDetail;
        sceneObject : THREE.Line;

        constructor(firstTime : Date, lastTime : Date) {
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


            for (var day = firstTime.getTime();
                 day <= lastTime.getTime();
                 day += dayInMilliSeconds)
            {
                const dayDate = new Date(day);
                const t = (day - firstTime.getTime())/dateDiff;
                const xpos = -1*(1 - t) + t;

                if (dayDate.getMonth() == 0 && dayDate.getDate() == 1) {
                    let object = new THREE.Line(vertLineGeoH1, material);
                    object.translateX(xpos);
                    this.sceneObject.add(object);
                } else if (dayDate.getDate() == 1) {
                    let object = new THREE.Line(vertLineGeoH2, material);
                    object.translateX(xpos);
                    this.sceneObject.add(object);
                } else {
                    let object = new THREE.Line(vertLineGeoH3, material);
                    object.translateX(xpos);
                    this.sceneObject.add(object);
                }

            }


            // var N = 4;
            // for (var i = 0; i<=N; ++i) {
            //     let object = new THREE.Line(vertLineGeoH1, material);
            //     const t = i/N;
            //     const xpos = -1*(1 - t) + t;
            //     object.translateX(xpos);
            //     this.sceneObject.add(object);

            //     let date = resolveDate(xpos, new Date(2016, 4, 24),
            //                            convertMonthLengthToMilliseconds(4));

            //     let dateSprite = new DateSprite(
            //         `${date.getMonth() + 1}/${date.getFullYear()}`,
            //         0.2);
            //     dateSprite.sceneObject.translateX(xpos);
            //     dateSprite.sceneObject.translateY(-0.15);
            //     //dateSprite.sceneObject.rotateZ(Math.PI/2);
            //     this.sceneObject.add(dateSprite.sceneObject);
            // }
        }
    }

}
