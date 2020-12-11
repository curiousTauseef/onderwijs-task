

//cannot use import as it throws exception, hence use require feature
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

//blank arrays to hold results of searching operations
let updateExistingLst = [];
let deleteExistingList = [];
let delOverlappingExistingRels =[];

// Existing Relations Array
let existingRels = [];
//my test cases
/*
existingRels.push( {startDate: new Date("2010-3-17"), endDate : new Date("2010-6-20"), key : 6} );
existingRels.push( {startDate: new Date("2011-1-18"), endDate : new Date("2011-3-20"), key :7 } );
existingRels.push( {startDate: new Date("2011-4-18"), endDate : new Date("2011-6-20"), key :8 } );
existingRels.push( {startDate: new Date("2011-8-18"), endDate : new Date("2011-10-20"), key :9 } );

//lets put one overlapping too
existingRels.push( {startDate: new Date("2011-11-17"), endDate : new Date("2011-12-20"),key : 10} );

existingRels.push( {startDate: new Date("2021-4-17"), endDate : new Date("2021-5-20"), key:11} );
*/

//frederik testcase3
//existingRels.push( {key:1,startDate: new Date("2000-01-01"), endDate : new Date("2021-01-01")} );
//existingRels.push( {key:1,startDate: "2000-01-01", endDate : "2021-01-01"} );

//frederik testcase4
//existingRels.push( {key:1,startDate: "2000-01-01", endDate : "2011-01-01"} );
//existingRels.push( {key:2,startDate: "2013-01-01", endDate : "2021-01-01"} );




//console.log("existingRels");
//console.log(existingRels);

let desiredRels = [];
//my test cases
/*
desiredRels.push( {startDate: new Date("2010-4-10"), endDate : new Date("2011-1-10")} );
desiredRels.push( {startDate: new Date("2011-2-10"), endDate : new Date("2011-9-10")} );
desiredRels.push( {startDate: new Date("2011-12-10"), endDate : new Date("2014-9-10")} );
//now some very far away non overlapping ranges
desiredRels.push( {startDate: new Date("2015-01-10"), endDate : new Date("2015-09-10")} );
desiredRels.push( {startDate: new Date("2016-01-10"), endDate : new Date("2016-09-10")} );
*/

//frederik test case3
    //desiredRels.push( {startDate: new Date("2020-01-01"), endDate : new Date("2022-01-01")} );
//desiredRels.push( {startDate: "2020-01-01", endDate : "2022-01-01"} );

//frederik test case4
//desiredRels.push( {startDate: "2010-01-01", endDate : "2015-01-01"} );



//console.log("desiredRels");
//console.log(desiredRels);

//console.log("desired rels with overlap IDs");
/* for verification
console.log(
    desiredRels.map(el => ({ startDate:el.startDate, endDate:el.endDate, ovrID:0}))
  );
  */



function generateRelsForAPI(desiredRels,existingRels){
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>generateRelsForAPI<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    //Lets try to take simple examples of date ranges and update counts and store operations in a result array
    let resultArray = [];
    let desiredRels_ovrlpIDs = desiredRels.map(el => ({ startDate:el.startDate, endDate:el.endDate, ovrID:0}))
    console.log(desiredRels_ovrlpIDs)


    //check for non overlapping DELETE scenarios and update resultArray
    //Strategy : Take each el of existing and compare with desired.
    //If not overlapping mark for delete
    let overlapStatus = false; //start with no overlap initially
    //https://codeburst.io/comparison-of-two-arrays-using-javascript-3251d03877fe
    
    existingRels.forEach(e1 =>{ desiredRels.forEach(e2 => 
        {
            
              if(     moment.range(e1.startDate,e1.endDate).overlaps(moment.range(e2.startDate,e2.endDate)) == true) {
                  console.log("First looping : Moment overlap detected");
                  overlapStatus = true;
              }
        });
        //At this level, we have iterated over all items of desiredRels
        console.log("<<<<<<<<<<<<<<<<End of inner loop run : Lets check whats overlap status");
        console.log(overlapStatus);
  
        if(overlapStatus == false) { //The element e1 was tested against all items of desiredRels and no overlap was found
            console.log("Case of non overlapping deletion for an item of existing...");

            resultArray.push( {operation: "DELETE", body:e1} );
        }
        //end of running thru e1 curly brace block followed by ) and finally;
        overlapStatus = false;
  
    }
    );

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
                    deleteExistingList.push(e2.key)
                  }
                }

        });
        //At this level, we have iterated over all items of desiredRels
        //end of running thru e1 curly brace block followed by ) and finally;  
        console.log("<<<<<<<<<<<<<<<<End of inner loop run : Lets check whats e1");
        console.log(e1);

    }
    );

    //Now use the updateExistingLst and mark overlapping ExistingRels DELETEs : use filter operation
    delOverlappingExistingRels = existingRels.filter(el=> deleteExistingList.includes(el.key));
    delOverlappingExistingRels.forEach(e1=>{resultArray.push({operation:"DELETE", body:{key:e1.key, startDate:e1.startDate, endDate:e1.endDate}})})

    console.log("Dump result to be returned-------->");
    console.log(resultArray);
    return resultArray;
}
let retResult = generateRelsForAPI(desiredRels,existingRels);
console.log("Final returned result object");
console.log(retResult);

//console.log("Final list of updated existing rel indexes");
//console.log(updateExistingLst);

//console.log("Final list of desiredRels_ovrlpIDs");
//console.log(desiredRels_ovrlpIDs);



//console.log("Final list of deletion existing rel indexes");
//console.log(deleteExistingList);
//console.log("Show array of deletion");
//console.log(delOverlappingExistingRels);

//export the API so that the chai tests can use it for testing
module.exports = {
    generateRelsForAPI
}





    
      

