var vows = require("vows"),
    load = require("../load"),
    assert = require("../assert");

var suite = vows.describe("d4.transition");

suite.addBatch({
  "transition": {
    topic: load("transition/transition").document(),
    "selects the document element": function(d4) {
      var transition = d4.transition();
      assert.equal(transition.length, 1);
      assert.equal(transition[0].length, 1);
      assert.equal(transition[0][0].nodeType, 1);
      assert.equal(transition[0][0].tagName, "HTML");
    },
    "is an instanceof d4.transition": function(d4) {
      assert.isTrue(d4.transition() instanceof d4.transition);
    },
    "subselections are also instanceof d4.transition": function(d4) {
      var transition = d4.transition();
      assert.isTrue(transition.select("body") instanceof d4.transition);
      assert.isTrue(transition.selectAll("body") instanceof d4.transition);
    },
    "transition prototype can be extended": function(d4) {
      var transition = d4.transition(), vv = [];
      d4.transition.prototype.foo = function(v) { vv.push(v); return this; };
      transition.select("body").foo(42);
      assert.deepEqual(vv, [42]);
      delete d4.transition.prototype.foo;
    }
  }
});

// Subtransitions
suite.addBatch({
  "transition": {
    topic: load("transition/transition").document(),
    "select": require("./transition-test-select"),
    "selectAll": require("./transition-test-selectAll"),
    "transition": require("./transition-test-transition"),
    "filter": require("./transition-test-filter")
  }
});

// Content
suite.addBatch({
  "transition": {
    topic: load("transition/transition").document(),
    "attr": require("./transition-test-attr"),
    "attrTween": require("./transition-test-attrTween"),
    "style": require("./transition-test-style"),
    "styleTween": require("./transition-test-styleTween"),
    "text": require("./transition-test-text"),
    "remove": require("./transition-test-remove")
  }
});

// Animation
suite.addBatch({
  "transition": {
    topic: load("transition/transition").document(),
    "delay": require("./transition-test-delay"),
    "duration": require("./transition-test-duration")
  }
});

// Control
suite.addBatch({
  "transition": {
    topic: load("transition/transition").document(),
    "each": require("./transition-test-each"),
    "call": require("./transition-test-call"),
    "tween": require("./transition-test-tween"),
    "id": require("./transition-test-id"),
    "time": require("./transition-test-time")
  }
});

suite.export(module);
