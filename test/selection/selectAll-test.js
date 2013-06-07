var vows = require("vows"),
    load = require("../load"),
    assert = require("../assert");

var suite = vows.describe("d4.selectAll");

suite.addBatch({
  "selectAll": {
    topic: load("selection/selectAll").document(),
    "on a simple page": {
      topic: function(d4) {
        var body = d4.select("body");
        body.append("span").attr("class", "f00").attr("id", "b4r").attr("name", "b4z");
        body.append("div").attr("class", "foo").attr("id", "bar").attr("name", "baz");
        return d4;
      },
      "selects by element name": function(d4) {
        var div = d4.selectAll("div");
        assert.equal(div[0][0].tagName, "DIV");
      },
      "selects by class name": function(d4) {
        var div = d4.selectAll(".foo");
        assert.equal(div[0][0].className, "foo");
      },
      "selects by id": function(d4) {
        var div = d4.selectAll("div#bar");
        assert.equal(div[0][0].id, "bar");
      },
      "selects by attribute value": function(d4) {
        var div = d4.selectAll("[name=baz]");
        assert.equal(div[0][0].getAttribute("name"), "baz");
      },
      "selects by array": function(d4) {
        var body = d4.select("body").node(), div = d4.selectAll([body.lastChild]);
        assert.isTrue(div[0][0] === body.lastChild);
        assert.lengthOf(div, 1);
        assert.lengthOf(div[0], 1);
      },
      "groups are arrays, not NodeLists": function(d4) {
        var div = d4.select("body").selectAll(function() { return this.getElementsByClassName("div"); });
        assert.isTrue(Array.isArray(div[0]));
      },
      "sets the parentNode to the document element": function(d4) {
        var selection = d4.selectAll("body"),
            document = d4.selection().node().ownerDocument;
        assert.strictEqual(selection[0].parentNode, document.documentElement);
      }
    }
  }
});

suite.export(module);
