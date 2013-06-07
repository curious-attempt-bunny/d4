var vows = require("vows"),
    load = require("../load"),
    assert = require("../assert");

var suite = vows.describe("d4.selection");

suite.addBatch({
  "selection": {
    topic: load("selection/selection").document(),
    "selects the document element": function(d4) {
      var selection = d4.selection();
      assert.equal(selection.length, 1);
      assert.equal(selection[0].length, 1);
      assert.equal(selection[0][0].nodeType, 1);
      assert.equal(selection[0][0].tagName, "HTML");
    },
    "the parentNode is also the document element": function(d4) {
      var parentNode = d4.selection()[0].parentNode;
      assert.equal(parentNode.nodeType, 1);
      assert.equal(parentNode.tagName, "HTML");
    },
    "is an instanceof d4.selection": function(d4) {
      assert.instanceOf(d4.selection(), d4.selection);
    },
    "subselections are also instanceof d4.selection": function(d4) {
      assert.instanceOf(d4.selection().select("body"), d4.selection);
      assert.instanceOf(d4.selection().selectAll("body"), d4.selection);
    },
    "selection prototype can be extended": function(d4) {
      d4.selection.prototype.foo = function(v) { return this.attr("foo", v); };
      var body = d4.selection().select("body").foo(42);
      assert.equal(body.attr("foo"), "42");
      delete d4.selection.prototype.foo;
    }
  }
});

suite.export(module);
