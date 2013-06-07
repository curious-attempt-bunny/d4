var vows = require("vows"),
    load = require("../load"),
    assert = require("../assert");

var suite = vows.describe("d4.interpolateRound");

suite.addBatch({
  "interpolateRound": {
    topic: load("interpolate/round").expression("d4.interpolateRound"),
    "interpolates integers": function(interpolate) {
      assert.strictEqual(interpolate(2, 12)(.456), 7);
      assert.strictEqual(interpolate(2, 12)(.678), 9);
    }
  }
});

suite.export(module);
