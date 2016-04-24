namespace MassiveTimeline {
    namespace DateUtil {
        function convertMonthLengthToMilliseconds(numberOfMonths:number) {
            return 1000*60*60*24*31*numberOfMonths;
        }

        function resolveDate(t : number, zero : Date, viewTimeLength : number) {
            let firstTime = zero.getTime() - viewTimeLength;
            let lastTime = zero.getTime() + viewTimeLength;
            t = (1 + t)/2.0; // maps [-1, 1] interval to [0, 1] interval

            return new Date(firstTime*(1 - t) + lastTime*t);
        }
    }
}
