//const assert = require('assert')
const { generateRelsForAPI } = require('../task')

var expect = require('chai').expect;
var assert = require('chai').assert;
var chai = require('chai');
chai.use(require('chai-datetime'));

/*
it('CREATE case 1 ', () => {
  expect(generateRelsForAPI([{startDate: new Date("2020-3-17").toISOString().substring(0, 10), endDate : new Date("2020-6-20").toISOString().substring(0, 10)}],[])).to.eql( [{
    operation: 'CREATE',
    body: {
      startDate:'2020-03-16',
      endDate: '2020-06-19'
    }
  }]);

  
});
*/

it('CREATE case 1 ', () => {
  expect(generateRelsForAPI([{startDate: "2020-03-17", endDate : "2020-06-20"}],[])).to.eql( [{
    operation: 'CREATE',
    body: {
      startDate:'2020-03-17',
      endDate: '2020-06-20'
    }
  }]);
  
});

it('DELETE case 2 ', () => {
  expect(generateRelsForAPI([],[{key:1,startDate:"2020-01-01", endDate : "2021-01-01"}])).to.eql( [{
    operation: 'DELETE',
    body: { key:1,
      startDate:'2020-01-01',
      endDate: '2021-01-01'
    }
  }]);
  
});


it('UPDATE case 3 ', () => {
  expect(generateRelsForAPI([{startDate: "2020-01-01", endDate : "2022-01-01"}],[{key:1,startDate: "2000-01-01", endDate : "2021-01-01"}])).to.eql( [{
    operation: 'UPDATE',
    body: { key:1,
      startDate:'2020-01-01',
      endDate: '2022-01-01'
    }
  }]);
  
});

//This currently fails because ordering of DELETE and UPDATE is not done 
it('UPDATE DELETE case 4 ', () => {
  expect(generateRelsForAPI([{startDate: "2010-01-01", endDate : "2015-01-01"}],[{key:1,startDate: "2000-01-01", endDate : "2011-01-01"},{key:2,startDate: "2013-01-01", endDate : "2021-01-01"}])).to.eql( [
    {
    operation: 'DELETE',
    body: { key:2,
      startDate:'2013-01-01',
      endDate: '2021-01-01'
          }
    },
    {
      operation: 'UPDATE',
      body: { key:1,
        startDate:'2010-01-01',
        endDate: '2015-01-01'
            }
      }
  ]);
  
});

//new test cases from Tauseef
it('Combined CREATE UPDATE DELETE case 6 ', () => {
  expect(generateRelsForAPI(
    [{startDate: "2010-04-10", endDate : "2011-01-10"},
     {startDate: "2011-02-10", endDate : "2011-09-10"},
     {startDate: "2011-12-10", endDate : "2014-09-10"},
     {startDate: "2015-01-10", endDate : "2015-09-10"},
     {startDate: "2016-01-10", endDate : "2016-09-10"}
     ],
     [{key:1,startDate: "2010-03-17", endDate : "2011-06-20"},
       //next three(2,3,4) keys let them overlap with one period of desired so that overlapping deletions occur
        {key:2,startDate: "2011-01-18", endDate : "2011-03-20"},
        //keys 3 and 4 should be deleted
        {key:3,startDate: "2011-04-18", endDate : "2011-06-20"},
        {key:4,startDate: "2011-08-18", endDate : "2011-10-20"},
        //now back to standard overlapping
        {key:5,startDate: "2011-11-17", endDate : "2011-12-20"},
        //one range very far so that non overlapping deletion is tested
        {key:6,startDate: "2021-04-17", endDate : "2021-01-01"}
      ])).to.eql(
      [
          {
            operation: 'DELETE',
            body: { key: 6, startDate: '2021-04-17', endDate: '2021-01-01' }
          },
          {
            operation: 'UPDATE',
            body: { key: 1, startDate: '2010-04-10', endDate: '2011-01-10' }
          },
          {
            operation: 'UPDATE',
            body: { key: 1, startDate: '2011-02-10', endDate: '2011-09-10' }
          },
          {
            operation: 'UPDATE',
            body: { key: 5, startDate: '2011-12-10', endDate: '2014-09-10' }
          },
          {
            operation: 'CREATE',
            body: { startDate: '2015-01-10', endDate: '2015-09-10' }
          },
          {
            operation: 'CREATE',
            body: { startDate: '2016-01-10', endDate: '2016-09-10' }
          },
          {
            operation: 'DELETE',
            body: { key: 2, startDate: '2011-01-18', endDate: '2011-03-20' }
          },
          {
            operation: 'DELETE',
            body: { key: 3, startDate: '2011-04-18', endDate: '2011-06-20' }
          },
          {
            operation: 'DELETE',
            body: { key: 4, startDate: '2011-08-18', endDate: '2011-10-20' }
          }
      ].sort((a, b) => (`${a.operation},${a.body.key},${a.body.startDate}` < `${b.operation},${b.body.key},${b.body.startDate}` ? -1 : 1))
         
  );
  
});

it('Combined Same start and end date not producing anything in output 7 ', () => {
  expect(generateRelsForAPI(
     [{startDate: "2010-03-17", endDate : "2011-06-20"},
       //next three(2,3,4) keys let them overlap with one period of desired so that overlapping deletions occur
        {startDate: "2011-01-18", endDate : "2011-03-20"},
        //keys 3 and 4 should be deleted
        {startDate: "2011-04-18", endDate : "2011-06-20"},
        {startDate: "2011-08-18", endDate : "2011-10-20"},
        //now back to standard overlapping
        {startDate: "2011-11-17", endDate : "2011-12-20"},
        //one range very far so that non overlapping deletion is tested
        {startDate: "2021-04-17", endDate : "2021-01-01"}
      ],
     [{key:1,startDate: "2010-03-17", endDate : "2011-06-20"},
       //next three(2,3,4) keys let them overlap with one period of desired so that overlapping deletions occur
        {key:2,startDate: "2011-01-18", endDate : "2011-03-20"},
        //keys 3 and 4 should be deleted
        {key:3,startDate: "2011-04-18", endDate : "2011-06-20"},
        {key:4,startDate: "2011-08-18", endDate : "2011-10-20"},
        //now back to standard overlapping
        {key:5,startDate: "2011-11-17", endDate : "2011-12-20"},
        //one range very far so that non overlapping deletion is tested
        {key:6,startDate: "2021-04-17", endDate : "2021-01-01"}
      ])).to.eql(
      [  ]
         
  );
  
});

it('DUPLICATEs with CREATE and DELETE case 8 ', () => {
  expect(generateRelsForAPI([
    //Lets take first two items to be same 
    {startDate: "2010-03-17", endDate : "2010-06-20"},
    {startDate: "2015-03-17", endDate : "2015-06-20"},
    //Now take one different:must be created
    {startDate: "2020-03-17", endDate : "2020-06-20"},
  
    ],
    [
      //Lets take first two items to be same 
      {key:1,startDate: "2010-03-17", endDate : "2010-06-20"},
      {key:2,startDate: "2015-03-17", endDate : "2015-06-20"},
      //Now take on different-must be deleted
      {key:3,startDate: "2019-03-17", endDate : "2019-06-20"},

    ])).to.eql( [
    {
      operation: 'CREATE',
      body: {
        startDate:'2020-03-17',
        endDate: '2020-06-20'
      }
    },
    {
      operation: 'DELETE',
      body: {
        key:3,
        startDate:'2019-03-17',
        endDate: '2019-06-20'
      }
    }


    ]);
  
});


