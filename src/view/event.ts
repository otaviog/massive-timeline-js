// <reference path="typings/three/three.d.ts" />

namespace MassiveTimeline {
    /**
     * A timeline event.
     */
    export class Event {
        startDate : Date;
        endDate : Date;
        title : string;
        description : string;
        color : THREE.Color;
    }
}
