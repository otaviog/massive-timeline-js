namespace MassiveTimeline {
    export class timespace {
        static DayInMilliSeconds = 1000*60*60*24;
        static DayLengthInSpace = 1/365;
        static EventObjectHeight = 0.1;

        public static measureDateSpaceDistance(firstDate : Date, date: Date) {
            const dayInMilliSeconds = 1000 * 60 * 60 * 24;
            const dayStep = 1 / 365;
            const howManyDays = Math.round((date.getTime() - firstDate.getTime())
                                           / dayInMilliSeconds);
            return howManyDays * dayStep - 1;
        }
    }
}
