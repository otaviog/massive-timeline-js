// <reference path="typings/three/three.d.ts" />
/// <reference path="timeline.ts" />
/// <reference path="event.ts" />
/// <reference path="timespacemetrics.ts" />

namespace MassiveTimeline {
    export class EventObject extends THREE.Mesh {
        constructor(event: Event, ynth: number, parent_timeline: TimeLine) {
            const startXPos = parent_timeline.convertDateToXPos(event.startDate);
            const endXPos = parent_timeline.convertDateToXPos(event.endDate);
            const xHalfLength = (endXPos - startXPos) * 0.5;
            super(new THREE.PlaneGeometry(
                xHalfLength, 0.01),
                new THREE.MeshBasicMaterial({
                    color: event.color
                }));
            //console.log(event.color.getHexString());
            //console.log(event.color.getHex());

            this.position.x = startXPos + xHalfLength;
            this.position.y = 0.1 + ynth * timespace.EventObjectHeight;
        }

        private static _getEventLength(event: Event) {
            return ((event.endDate.getTime() - event.startDate.getTime())
                / timespace.DayInMilliSeconds) * timespace.DayLengthInSpace;
        }
    }

    export class EventSprite {

    }
} // MassiveTimeline
