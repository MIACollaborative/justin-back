import { DateTime, Interval, Duration, DurationUnit, DurationLikeObject, DurationObjectUnits } from "luxon";

export default class GeneralUtility {

    static unitList = ["year", "month", "day", "hour", "minute", "second", "millisecond"]
;
    static areDatesMatchedUpByGranularity(date1:Date, date2:Date, unitString:string):boolean {
        let result = false;

        let datetime1 = DateTime.fromJSDate(GeneralUtility.zeroAfterUnit(date1, unitString));
        let datetime2 = DateTime.fromJSDate(GeneralUtility.zeroAfterUnit(date2, unitString));

        // as keyof UserModel

        console.log(`${this.name}.areDatesMatchedUpByGranularity before comparison date1: ${datetime1}`);
        console.log(`${this.name}.areDatesMatchedUpByGranularity before comparison date2: ${datetime2}`);

        let diffDateTime:Duration = GeneralUtility.diffDateTime(datetime1, datetime2, [`${unitString}s` as keyof DurationLikeObject]);

        console.log(`diffDateTime: ${JSON.stringify(diffDateTime.toObject())}`);

        let unitsString = `${unitString}s`;
        if ( (diffDateTime.toObject())[unitsString as keyof DurationObjectUnits] != 0) {
            result = false;
        }
        else {
            result = true;
        }

        return result;
    }  
    
    static zeroAfterUnit(dateA:Date, unitString:string): Date {
        //console.log(`${this.name}.zeroAfterUnit before zeroing: ${dateA}`);
        let newDateTime = DateTime.fromJSDate(dateA);


        let unitIndex = GeneralUtility.unitList.indexOf(unitString);

        for(let i = 0; i < this.unitList.length; i++){
            let curUnit = this.unitList[i];

            //console.log(`curUnit: ${curUnit}`);

            if(i > unitIndex){
                let option = {[curUnit as keyof DurationObjectUnits]: 0};
                //console.log(`curUnit set 0: ${JSON.stringify(option)}`);
                newDateTime = newDateTime.set(option);
            }
        }
        
        //console.log(`${this.name}.zeroAfterUnit before return: ${newDateTime}`);

        return newDateTime.toJSDate();
    }

    static diffDateTime(datetimeA:DateTime, datetimeB:DateTime, unitsList: DurationUnit[]): Duration {

        return datetimeB.diff(datetimeA, unitsList);
    }
}