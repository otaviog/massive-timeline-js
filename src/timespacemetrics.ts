namespace MassiveTimeline {
    export class timespace {
        static DayInMilliSeconds = 1000*60*60*24;
        static DayLengthInSpace = 0.01;
        static EventObjectHeight = 0.1;

        public static measureDateSpaceDistance(firstDate : Date, date: Date) {
            const howManyDays = Math.round((date.getTime() - firstDate.getTime())
                                           / timespace.DayInMilliSeconds);
            return howManyDays * timespace.DayLengthInSpace - 1;
        }
    }
}
