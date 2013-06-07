var vows = require("vows"),
    load = require("../load"),
    assert = require("../assert");

var suite = vows.describe("d4.interpolateHcl");

suite.addBatch({
  "interpolateHcl": {
    topic: load("interpolate/hcl"), // beware instanceof d4_Color
    "parses string input": function(d4) {
      assert.strictEqual(d4.interpolateHcl("steelblue", "#f00")(.2), "#6978c9");
      assert.strictEqual(d4.interpolateHcl("steelblue", "#f00")(.6), "#e034a2");
    },
    "parses d4.hsl input": function(d4) {
      assert.strictEqual(d4.interpolateHcl(d4.hsl("steelblue"), "#f00")(.2), "#6978c9");
      assert.strictEqual(d4.interpolateHcl("steelblue", d4.hsl(0, 1, .5))(.6), "#e034a2");
    },
    "parses d4.rgb input": function(d4) {
      assert.strictEqual(d4.interpolateHcl(d4.rgb("steelblue"), "#f00")(.2), "#6978c9");
      assert.strictEqual(d4.interpolateHcl("steelblue", d4.rgb(255, 0, 0))(.6), "#e034a2");
    },
    "interpolates in HSL color space": function(d4) {
      assert.strictEqual(d4.interpolateHcl("steelblue", "#f00")(.2), "#6978c9");
    },
    "uses source hue when destination hue is undefined": function(d4) {
      assert.equal(d4.interpolateHcl("#f60", "#000")(.5), "#9b0000");
      assert.equal(d4.interpolateHcl("#6f0", "#000")(.5), "#008100");
    },
    "uses destination hue when source hue is undefined": function(d4) {
      assert.equal(d4.interpolateHcl("#000", "#f60")(.5), "#9b0000");
      assert.equal(d4.interpolateHcl("#000", "#6f0")(.5), "#008100");
    },
    "uses source chroma when destination chroma is undefined": function(d4) {
      assert.equal(d4.interpolateHcl("#ccc", "#000")(.5), "#616161");
      assert.equal(d4.interpolateHcl("#f00", "#000")(.5), "#a60000");
    },
    "uses destination chroma when source chroma is undefined": function(d4) {
      assert.equal(d4.interpolateHcl("#000", "#ccc")(.5), "#616161");
      assert.equal(d4.interpolateHcl("#000", "#f00")(.5), "#a60000");
    },
    "outputs a hexadecimal string": function(d4) {
      assert.strictEqual(d4.interpolateHcl("steelblue", "#f00")(.2), "#6978c9");
    }
  }
});

suite.export(module);
