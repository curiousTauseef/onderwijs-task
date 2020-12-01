import { createRequire } from 'module';
const require = createRequire(import.meta.url);

//const add = (a, b) => a + b

//const subtract = (a, b) => a - b
//function generateRelsForApi(desiredRels, existingRels)

//import * as moment from 'moment';
//import 'moment-range';

const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

//helper functions
//For a pair of date ranges
function dateRangeOverlaps(a_start, a_end, b_start, b_end) {
        if (a_start < b_start && b_start < a_end) return true; // b starts in a
        if (a_start < b_end   && b_end   < a_end) return true; // b ends in a
        if (b_start <  a_start && a_end   <  b_end) return true; // a in b
        return false;
    }
    
    //For an array containing date ranges
    function multipleDateRangeOverlaps(timeEntries) {
        let i = 0, j = 0;
        let timeIntervals = timeEntries.filter(entry => entry.from != null && entry.to != null && entry.from.length === 8 && entry.to.length === 8);
    
        if (timeIntervals != null && timeIntervals.length > 1)
        for (i = 0; i < timeIntervals.length - 1; i += 1) {
            for (j = i + 1; j < timeIntervals.length; j += 1) {
                    if (
                    dateRangeOverlaps(
                timeIntervals[i].from.getTime(), timeIntervals[i].to.getTime(),
                timeIntervals[j].from.getTime(), timeIntervals[j].to.getTime()
                        )
                    ) return true;
                }
            }
       return false;
    }

//just to check if async logic is okay
function asyncAddFunction(a, b, callback) {
        callback(a + b); //This callback is the one passed in to the function call below.
      }
      
      asyncAddFunction(2, 4, function(sum) {
        //Here we have the sum, 2 + 4 = 6.
        console.log(sum);
      });
//END:just to check if async logic is okay

const date1 = new Date('July 10, 2018 07:22:13')
const date2 = new Date('July 10, 2018 07:22:13')
if (date2.getTime() === date1.getTime()) {
  console.log("dates are equal");
}


// Relation Object
var relation = function (startDate, endDate) {
        //this.Name = name;
        this.StartDate = startDate;
        this.EndDate = endDate;
    }
    
    // Existing Relations Array
    let existingRels = [];
    existingRels.push(new relation(moment("2011-04-15"), moment("2011-04-15")));
    console.log(existingRels[0]);

    //existingRels.push(new relation('Mercedes', 'Merc.png'));
    //existingRels.push(new vehicle('Nissan', 'Nissan.png'));

    let desiredRels = [];
    //desiredRels.push(new vehicle('Mercedes', 'Merc.png'));
    // desiredRels.push(new vehicle('Nissan', 'Nissan.png'));

   function generateRelsForAPI(desiredRels,existingRels){
        let resultArray = [];

        //check for CREATE scenarios and update resultArray
        //when a array item in desiredRels has no overlap with any items in existingRels

        //check for DELETE scenarios and update resultArray
        //when a array item in existingRels has no overlap with any items in desiredRels



        //check for UPDATE scenarios and update resultArray
        //first : array item of desiredRels overlaps with exactly one item of existingRels, introduce overlapoccurencefreq
        //second : array item of desiredRels overlaps with more than one item of existingRels

        
        // Loop through array values
        for(i=0; i < array.length; i++){
            if(uniqueArray.indexOf(array[i]) === -1) {
                uniqueArray.push(array[i]);
            }
        }
        return uniqueArray;
    }
    
    
      

/*
module.exports = {
        add,
        subtract
}
*/
