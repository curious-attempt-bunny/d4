var vows = require("vows"),
    load = require("../load"),
    assert = require("../assert");

var suite = vows.describe("d4.interpolateHsl");

suite.addBatch({
  "interpolateHsl": {
    topic: load("interpolate/hsl"), // beware instanceof d4_Color
    "parses string input": function(d4) {
      assert.strictEqual(d4.interpolateHsl("steelblue", "#f00")(.2), "#383dc3");
      assert.strictEqual(d4.interpolateHsl("steelblue", "#f00")(.6), "#dd1ce1");
    },
    "parses d4.hsl input": function(d4) {
      assert.strictEqual(d4.interpolateHsl(d4.hsl("steelblue"), "#f00")(.2), "#383dc3");
      assert.strictEqual(d4.interpolateHsl("steelblue", d4.hsl(0, 1, .5))(.6), "#dd1ce1");
    },
    "parses d4.rgb input": function(d4) {
      assert.strictEqual(d4.interpolateHsl(d4.rgb("steelblue"), "#f00")(.2), "#383dc3");
      assert.strictEqual(d4.interpolateHsl("steelblue", d4.rgb(255, 0, 0))(.6), "#dd1ce1");
    },
    "interpolates in HSL color space": function(d4) {
      assert.strictEqual(d4.interpolateHsl("steelblue", "#f00")(.2), "#383dc3");
    },
    "uses source hue when destination hue is undefined": function(d4) {
      assert.equal(d4.interpolateHsl("#f60", "#000")(.5), "#803300");
      assert.equal(d4.interpolateHsl("#6f0", "#fff")(.5), "#b3ff80");
    },
    "uses destination hue when source hue is undefined": function(d4) {
      assert.equal(d4.interpolateHsl("#000", "#f60")(.5), "#803300");
      assert.equal(d4.interpolateHsl("#fff", "#6f0")(.5), "#b3ff80");
    },
    "uses source saturation when destination saturation is undefined": function(d4) {
      assert.equal(d4.interpolateHsl("#ccc", "#000")(.5), "#666666");
      assert.equal(d4.interpolateHsl("#f00", "#000")(.5), "#800000");
    },
    "uses destination saturation when source saturation is undefined": function(d4) {
      assert.equal(d4.interpolateHsl("#000", "#ccc")(.5), "#666666");
      assert.equal(d4.interpolateHsl("#000", "#f00")(.5), "#800000");
    },
    "outputs a hexadecimal string": function(d4) {
      assert.strictEqual(d4.interpolateHsl("steelblue", "#f00")(.2), "#383dc3");
    }
  }
});

suite.export(module);
