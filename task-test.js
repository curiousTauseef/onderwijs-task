//const assert = require('assert')
const { generateRelsForAPI } = require('./task')

var expect = require('chai').expect;
var assert = require('chai').assert;


test('should perform a CREATE', () => {
assert(generateRelsForAPI([{startDate: new Date("2020-3-17"), endDate : new Date("2020-6-20")}],[])).deepEqual( [{
    operation: 'CREATE',
    body: {
      startDate: "2020-03-16T23:00:00.000Z",
      endDate: "2020-06-19T22:00:00.000Z"
    }
  }]);

})