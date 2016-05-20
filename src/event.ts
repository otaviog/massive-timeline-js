// <reference path="typings/three/three.d.ts" />

namespace MassiveTimeline {

    /**
     * A timeline event.
     */
    export class Event {
        constructor(startDate: Date = null, endDate: Date = null, title: string = null,
            description: string = null, color: number = null) {
            this.startDate = startDate;
            this.endDate = endDate;
            this.title = title;
            this.description = description;
            this.color = color;
        }
        startDate: Date;
        endDate: Date;
        title: string;
        description: string;
        //color: THREE.Color;
        color: number;
    }
}
