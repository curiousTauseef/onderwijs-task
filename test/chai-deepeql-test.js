//https://stackoverflow.com/questions/13792885/nodejs-deep-equal-with-differences
var expect = require('chai').expect;

it("shows a diff of arrays", function() {
  expect([1,2,3]).to.deep.equal([1,2,3, {}]);
});

it("shows a diff of objects", function() {
  expect({foo: "bar"}).to.deep.equal({foo: "bar", baz: "bub"});
});