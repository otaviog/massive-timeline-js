// <reference path="typings/three/three.d.ts" />
/// <reference path="timeline.ts" />
/// <reference path="event.ts" />
/// <reference path="timespacemetrics.ts" />

namespace MassiveTimeline {
    export class EventObject extends THREE.Mesh {
        constructor(event : Event) {
            super(new THREE.PlaneGeometry(
                EventObject._getEventLength(event), 0.01),
                  new THREE.MeshBasicMaterial({
                      color : event.color.getHexString()
                  }));
        }


        private static _getEventLength(event : Event) {
            return ((event.endDate.getTime() - event.startDate.getTime())
                    / timespace.DayInMilliSeconds)*timespace.DayLengthInSpace;
        }
    }

    export class EventSprite {

    }
} // MassiveTimeline
