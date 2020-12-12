

//cannot use import as it throws exception, hence use require feature
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

//blank arrays to hold results of searching operations
let updateExistingLst = [];
let deleteExistingList = [];
let delOverlappingExistingRels =[];

// Existing and Desired Relations Array
const existingRels = [];
const desiredRels = [];

function generateRelsForAPI(desiredRels,existingRels){
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>generateRelsForAPI<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    //Lets try to take simple examples of date ranges and update counts and store operations in a result array
    let resultArray = [];
    let desiredRels_ovrlpIDs = desiredRels.map(el => ({ startDate:el.startDate, endDate:el.endDate, ovrID:0}))
    console.log(desiredRels_ovrlpIDs)

    //First we check for non overlapping DELETE scenarios and update resultArray
    //Strategy : Take each el of existing and compare with desired.
    //If not overlapping mark for delete
    let overlapStatus = false; //start with no overlap initially
    //https://codeburst.io/comparison-of-two-arrays-using-javascript-3251d03877fe
    
    existingRels.forEach(e1 =>{ desiredRels.forEach(e2 => 
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
    desiredRels_ovrlpIDs.forEach(e1 =>{ existingRels.forEach(e2 => 
        {//We have marked ovrID 0 for each element in desiredREls. Lets check if element of desiredREls has overlap
            //If it has overlap then check if overID. if overID is 0 then first time overlap occurs- chng ovrID and mark for overlap
            //If despite overlap, ovrID is non zero then it means not first time overlap -> element of existingRel must be deleted
            console.log("Second looping : Mark for updates: Run thru item des e1");
            console.log(e1);
            console.log("with existing e1");
            console.log(e2);

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

    //Now use the updateExistingLst and mark overlapping ExistingRels DELETEs : use filter operation
    //These are DELETES from items of Existing which overlapped with an item of desired but that item of desired had already overlapped to mark UPDATE another item of existing
    delOverlappingExistingRels = existingRels.filter(el=> deleteExistingList.includes(el.key));
    delOverlappingExistingRels.forEach(e1=>{resultArray.push({operation:"DELETE", body:{key:e1.key, startDate:e1.startDate, endDate:e1.endDate}})})

    console.log("Dump result to be returned-------->");
    console.log(resultArray);
    return resultArray;
}
let retResult = generateRelsForAPI(desiredRels,existingRels);
console.log("Final returned result object");
console.log(retResult);

//export the API so that the chai tests can use it for testing
module.exports = {
    generateRelsForAPI
}