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

