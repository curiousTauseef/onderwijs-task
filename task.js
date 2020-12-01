
var r1 = {
    start: new Date("2001-1-16"),
    end: new Date("2001-7-20")
  };
  
  var r2 = {
    start: new Date("2001-7-25"),
    end: new Date("2001-8-14")
  };
  
  // start date overlaps with end date of previous
  var r3 = {
    start: new Date("2001-3-18"),
    end: new Date("2001-9-20")
  };
  
var ranges = [r1, r3, r2];
console.log(ranges);


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

    console.log("check multiple range overlap function")
    console.log(multipleDateRangeOverlaps(ranges));
    console.log("checked multiple range overlap function");

    console.log("check pairwise range overlap function")
    console.log(dateRangeOverlaps(new Date("2020-1-15"),new Date("2020-4-16"),new Date("2020-3-17"),new Date("2020-6-20")));
    console.log("checked multiple range overlap function");


    console.log("check pairwise range overlap function")
    console.log(dateRangeOverlaps(new Date("2020-1-17"),new Date("2020-4-18"),new Date("2020-4-19"),new Date("2020-6-20")));
    console.log("checked pairwise range overlap function");



const date1 = new Date('July 10, 2018 07:22:13')
const date2 = new Date('July 10, 2018 07:22:13')
if (date2.getTime() === date1.getTime()) {
  console.log("dates are equal");
}

    
    // Existing Relations Array
    let existingRels = [];

    //existingRels.push( {startDate: new Date("2020-1-15"), endDate : new Date("2020-4-16")} );
    console.log("existingRels");

    console.log(existingRels);

    /*
    let existingRels_uniq = [];
    //existingRels_uniq = Array.filter(existingRels);

    existingRels_uniq = existingRels.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    })
    //console.log(existingRels);
    console.log(existingRels_uniq);
    */


    let desiredRels = [];
    desiredRels.push( {startDate: new Date("2020-3-17"), endDate : new Date("2020-6-20")} );

    console.log("desiredRels");
    console.log(desiredRels);


   function generateRelsForAPI(desiredRels,existingRels){
       //Lets try to take simple examples of date ranges and update counts and store operations in a result array
        let resultArray = [];
        let CREATE_count = 0;
        let DELETE_count = 0;
        let UPDATE_count = 0;

        console.log(desiredRels.length);

        console.log(existingRels.length);


        //check for CREATE scenarios and update resultArray
        //when a array item in desiredRels has no overlap with any items in existingRels
        //two cases : 
        //CASE1:when no items in existingRels and at least one item in desiredRels
        //CASE2:when non zero items in existingRels and at least one item in desiredRels
        if ( existingRels.length==0 && desiredRels.length!=0){
            for (var i = 0; i < desiredRels.length; i++){

                //console.log(desiredRels[0].startDate);
                //console.log(desiredRels[0].endDate);
                
                // check for overlap, here
                    console.log("case1:CREATE_count");
                    var idx = i;
                    var tmpObj = desiredRels[i];
                    CREATE_count=CREATE_count+1;
                    resultArray.push( {operation: "CREATE", body:tmpObj} );
  
            }
        }


        for (var i = 0; i < existingRels.length; i++){

            console.log(desiredRels[0].startDate);
            console.log(desiredRels[0].endDate);
            console.log(existingRels[0].startDate);
            
            // check for overlap, here
            if( (dateRangeOverlaps(desiredRels[0].startDate,desiredRels[0].endDate,existingRels[i].startDate,existingRels[i].endDate)) == false) {
                console.log("case2:CREATE_count");
                console.log(CREATE_count);
                var idx = i;
                var tmpObj = desiredRels[i];

                CREATE_count=CREATE_count+1;
                resultArray.push( {operation: "CREATE", body:tmpObj} );

            }



        }

        console.log("Final:CREATE_count");
        console.log(CREATE_count);
        console.log(resultArray);
        return resultArray;




        //check for DELETE scenarios and update resultArray
        //when a array item in existingRels has no overlap with any items in desiredRels



        //check for UPDATE scenarios and update resultArray
        //first : array item of desiredRels overlaps with exactly one item of existingRels, introduce overlapoccurencefreq
        //second : array item of desiredRels overlaps with more than one item of existingRels

        
        
    }

    //generateRelsForAPI(desiredRels,existingRels);

    
    
      


module.exports = {
    generateRelsForAPI
}

