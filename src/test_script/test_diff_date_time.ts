import GeneralUtility from "../utilities/generalutilities";

let date1 = new Date(1972, 2, 2, 18, 3, 40);
let date2 = new Date(1972, 2, 2, 18, 3, 30);


//console.log(`GeneralUtility.zeroAfterUnit: ${GeneralUtility.zeroAfterUnit(date1, "hour")}`);

console.log(`GeneralUtility.areDatesMatchedUpByGranularity: ${GeneralUtility.areDatesMatchedUpByGranularity(date1, date2, "minute")}`);