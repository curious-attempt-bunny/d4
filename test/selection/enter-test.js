var vows = require("vows"),
    load = require("../load"),
    assert = require("../assert");

var suite = vows.describe("selection.enter");

suite.addBatch({
  "selectAll(div)": {
    topic: load("selection/enter").document(),
    "is an instanceof d4.selection.enter": function(d4) {
      var enter = d4.select("body").selectAll("div").data([0, 1]).enter();
      assert.instanceOf(enter, d4.selection.enter);
    },
    "selection prototype can be extended": function(d4) {
      var enter = d4.select("body").html("").selectAll("div").data([0, 1]).enter();
      d4.selection.enter.prototype.foo = function() { return this.append("foo"); };
      var selection = enter.foo();
      assert.equal(d4.select("body").html(), "<foo></foo><foo></foo>");
      delete d4.selection.enter.prototype.foo;
    }
  }
});

suite.export(module);
