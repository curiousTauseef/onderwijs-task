

//cannot use import as it throws exception, hence use require feature
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

//blank arrays to hold results of searching operations
let updateExistingLst = [];
let delOverlappingExistingRels =[];

// Existing and Desired Relations Array
const existingRels = [];
const desiredRels = [];

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function arraycomparer(otherArray){
    return function(current){
      return otherArray.filter(function(other){
        return other.startDate == current.startDate && other.endDate == current.endDate
      }).length == 0;
    }
  }


function generateRelsForAPI(desiredRels,existingRels){
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>generateRelsForAPI<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    //Lets try to take simple examples of date ranges and update counts and store operations in a result array
    let resultArray = [];
    let deleteExistingList = [];

    let desiredRels_ovrlpIDs = desiredRels.map(el => ({ startDate:el.startDate, endDate:el.endDate, ovrID:0}))
    console.log(desiredRels_ovrlpIDs)

    const desiredRels_ovrlpIDs_uniq = desiredRels_ovrlpIDs.filter(arraycomparer(existingRels));
    const existingRels_uniq = existingRels.filter(arraycomparer(desiredRels_ovrlpIDs));

    /*
    var props = ['startDate', 'endDate'];
    var result = desiredRels.filter(function(o1){
        // filter out (!) items in result2
        return existingRels.some(function(o2){
            //return o1.id === o2.id;          // assumes unique id
            return moment.range(o1.startDate,o1.endDate).overlaps(moment.range(o2.startDate,o2.endDate)) ;          // assumes unique id

        });
    }).map(function(o){
        // use reduce to make objects with only the required properties
        // and map to apply this to the filtered array as a whole
        return props.reduce(function(newo, startDate,endDate){
            newo[startDate] = o[startDate];
            newo[endDate] = o[endDate];

            return newo;
        }, {});
    });

    console.log("Elegant reduce method");
    console.log(result);
    */




    //First we check for non overlapping DELETE scenarios and update resultArray
    //Strategy : Take each el of existing and compare with desired.
    //If not overlapping mark for delete
    let overlapStatus = false; //start with no overlap initially
    //https://codeburst.io/comparison-of-two-arrays-using-javascript-3251d03877fe
    
    existingRels_uniq.forEach(e1 =>{ desiredRels_ovrlpIDs_uniq.forEach(e2 => 
        {
               if( moment.range(e1.startDate,e1.endDate).overlaps(moment.range(e2.startDate,e2.endDate)) == true) {
                  console.log("First looping : Moment overlap detected");
                  overlapStatus = true;
                }
        });
        //At this level, we have iterated over all items of desiredRels
        console.log("<<<<<<<<<<<<<<<<End of inner loop run : An element of existing is checked against all els of desired : Lets check whats overlap status");
        console.log(overlapStatus);
  
        if(overlapStatus == false) { //The element e1 was tested against all items of desiredRels and no overlap was found
            console.log("Case of non overlapping deletion for an item of existing...Update result with this DELETE");
            resultArray.push( {operation: "DELETE", body:e1} );
        }
        //end of running thru e1 curly brace block followed by ) and finally;
        overlapStatus = false;
    });

    //Now mark for UPDATES and overlapping DELETEs
    desiredRels_ovrlpIDs_uniq.forEach(e1 =>{ existingRels_uniq.forEach(e2 => 
        {//We have marked ovrID 0 for each element in desiredREls. Lets check if element of desiredREls has overlap
            //If it has overlap then check if overID. if overID is 0 then first time overlap occurs- chng ovrID and mark for overlap
            //If despite overlap, ovrID is non zero then it means not first time overlap -> element of existingRel must be deleted
            console.log("Second looping : Checking if any updates: Run thru item des e1");
            //console.log(e1);
            //console.log("with existing e1");
            //console.log(e2);

              if(     moment.range(e1.startDate,e1.endDate).overlaps(moment.range(e2.startDate,e2.endDate)) == true) {
                  if(e1.ovrID == 0){//mark for update for el in Desired
                       console.log("Second looping:First time overlap of des e1")
                       resultArray.push( {operation: "UPDATE", body:{key:e2.key, startDate:e1.startDate, endDate:e1.endDate}} );
                       e1.ovrID = e2.key;
                       updateExistingLst.push(e2.key);
                  }
                  else{
                    console.log("Second looping:Detect secndt time overlap of des e1 where ovrID has been updated already. Hence case of overlapping DELETE...")
                    deleteExistingList.push(e2.key)
                  }
                }
        });
        //At this level, we have iterated over all items of existingRels (IMPORTANT to understand the exact point where inner loop completes)
        //end of running thru e1 curly brace block followed by ) and finally;  
        console.log("<<<<<<<<<<<<<<<<End of inner loop run : Lets check whats e1 of desired. Is there need to CREATE ?");
        console.log(e1);
        //At this level, e1 of desired has been checked for overlap with all e2 from existingRels, If overlap occured
        //then ovrID of e1 MUST have been updated with the correct key. If ovrID is still 0 it means no overlap occured -->case of CREATE for e1
        if(e1.ovrID == 0){
            console.log("No overlap seen for this item of desired. Mark for CREATE...")
            resultArray.push( {operation: "CREATE", body:{startDate:e1.startDate, endDate:e1.endDate}} );
        }
    }
    );

    console.log("Both loops have ended. Lets check our result now...");
    console.log(resultArray);

    console.log("Both loops have ended. Lets check if keys for any overlapping deletes are recorded...");
    console.log(deleteExistingList);


    //Now use the updateExistingLst and mark overlapping ExistingRels DELETEs : use filter operation
    //These are DELETES from items of Existing which overlapped with an item of desired but that item of desired had already overlapped to mark UPDATE another item of existing
    delOverlappingExistingRels = existingRels_uniq.filter(el=> deleteExistingList.includes(el.key));
    delOverlappingExistingRels.forEach(e1=>{resultArray.push({operation:"DELETE", body:{key:e1.key, startDate:e1.startDate, endDate:e1.endDate}})})

    console.log("Dump result to be returned-------->");
    //console.log(resultArray);

    let finalArray;
    //finalArray = resultArray.sort(dynamicSort("operation"));
    finalArray = resultArray.sort((a, b) => (`${a.operation},${a.body.key},${a.body.startDate}` < `${b.operation},${b.body.key},${b.body.startDate}` ? -1 : 1));
    console.log(finalArray);
    return finalArray;
   
}
let retResult = generateRelsForAPI(desiredRels,existingRels);
console.log("Final returned result object");
console.log(retResult);

//export the API so that the chai tests can use it for testing
module.exports = {
    generateRelsForAPI
}