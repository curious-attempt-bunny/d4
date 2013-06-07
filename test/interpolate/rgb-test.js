var vows = require("vows"),
    load = require("../load"),
    assert = require("../assert");

var suite = vows.describe("d4.interpolateRgb");

suite.addBatch({
  "interpolateRgb": {
    topic: load("interpolate/rgb"), // beware instanceof d4_Color
    "parses string input": function(d4) {
      assert.strictEqual(d4.interpolateRgb("steelblue", "#f00")(.2), "#6b6890");
      assert.strictEqual(d4.interpolateRgb("steelblue", "#f00")(.6), "#b53448");
    },
    "parses d4.rgb input": function(d4) {
      assert.strictEqual(d4.interpolateRgb(d4.rgb("steelblue"), "#f00")(.2), "#6b6890");
      assert.strictEqual(d4.interpolateRgb("steelblue", d4.rgb(255, 0, 0))(.6), "#b53448");
    },
    "parses d4.hsl input": function(d4) {
      assert.strictEqual(d4.interpolateRgb(d4.hsl("steelblue"), "#f00")(.2), "#6b6890");
      assert.strictEqual(d4.interpolateRgb("steelblue", d4.hsl(0, 1, .5))(.6), "#b53448");
    },
    "interpolates in RGB color space": function(d4) {
      assert.strictEqual(d4.interpolateRgb("steelblue", "#f00")(.2), "#6b6890");
    },
    "outputs an RGB string": function(d4) {
      assert.strictEqual(d4.interpolateRgb("steelblue", "#f00")(.2), "#6b6890");
    }
  }
});

suite.export(module);
