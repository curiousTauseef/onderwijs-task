//const assert = require('assert')
const { generateRelsForAPI } = require('../task')

var expect = require('chai').expect;
var assert = require('chai').assert;


it('CREATE case 1 ', () => {
  expect(generateRelsForAPI([{startDate: new Date("2020-3-17").toISOString().substring(0, 10), endDate : new Date("2020-6-20").toISOString().substring(0, 10)}],[])).to.eql( [{
    operation: 'CREATE',
    body: {
      startDate:'2020-03-16',
      endDate: '2020-06-19'
    }
  }]);

  
});
