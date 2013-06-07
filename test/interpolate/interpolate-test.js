var vows = require("vows"),
    load = require("../load"),
    assert = require("../assert");

var suite = vows.describe("d4.interpolate");

suite.addBatch({
  "interpolate": {
    topic: load("interpolate/interpolate").document(),

    "when b is a number": {
      "interpolates numbers": function(d4) {
        assert.strictEqual(d4.interpolate(2, 12)(.4), 6);
      },
      "coerces a to a number": function(d4) {
        assert.strictEqual(d4.interpolate("", 1)(.5), .5);
        assert.strictEqual(d4.interpolate("2", 12)(.4), 6);
        assert.strictEqual(d4.interpolate([2], 12)(.4), 6);
      }
    },

    "when b is a color string": {
      "interpolates RGB values and returns a hexadecimal string": function(d4) {
        assert.strictEqual(d4.interpolate("#ff0000", "#008000")(.4), "#993300");
      },
      "interpolates named colors in RGB": function(d4) {
        assert.strictEqual(d4.interpolate("red", "green")(.4), "#993300");
      },
      "interpolates decimal RGB colors in RGB": function(d4) {
        assert.strictEqual(d4.interpolate("rgb(255,0,0)", "rgb(0,128,0)")(.4), "#993300");
      },
      "interpolates decimal HSL colors in RGB": function(d4) {
        assert.strictEqual(d4.interpolate("hsl(0,100%,50%)", "hsl(120,100%,25%)")(.4), "#993300");
      },
      "coerces a to a color": function(d4) {
        assert.strictEqual(d4.interpolate({toString: function() { return "red"; }}, "green")(.4), "#993300");
      }
    },

    "when b is a color object": {
      "interpolates RGB values and returns a hexadecimal string": function(d4) {
        assert.strictEqual(d4.interpolate(d4.rgb(255, 0, 0), d4.rgb(0, 128, 0))(.4), "#993300");
      },
      "interpolates d4.hsl in RGB": function(d4) {
        assert.strictEqual(d4.interpolate(d4.hsl("red"), d4.hsl("green"))(.4), "#993300");
      },
      "interpolates d4.lab in RGB": function(d4) {
        assert.strictEqual(d4.interpolate(d4.lab("red"), d4.lab("green"))(.4), "#993300");
      },
      "interpolates d4.hcl in RGB": function(d4) {
        assert.strictEqual(d4.interpolate(d4.hcl("red"), d4.hcl("green"))(.4), "#993300");
      },
      "coerces a to a color": function(d4) {
        assert.strictEqual(d4.interpolate({toString: function() { return "red"; }}, "green")(.4), "#993300");
      }
    },

    "when b is a string": {
      "interpolates matching numbers in both strings": function(d4) {
        assert.strictEqual(d4.interpolate(" 10/20 30", "50/10 100 ")(.4), "26/16 58 ");
      },
      "if b is coercible to a number, still returns a string": function(d4) {
        assert.strictEqual(d4.interpolate("1.", "2.")(.5), "1.5");
        assert.strictEqual(d4.interpolate("1e+3", "1e+4")(.5), "5500");
      },
      "preserves non-numbers in string b": function(d4) {
        assert.strictEqual(d4.interpolate(" 10/20 30", "50/10 foo ")(.4), "26/16 foo ");
      },
      "preserves non-matching numbers in string b": function(d4) {
        assert.strictEqual(d4.interpolate(" 10/20 bar", "50/10 100 ")(.4), "26/16 100 ");
      },
      "preserves equal-value numbers in both strings": function(d4) {
        assert.strictEqual(d4.interpolate(" 10/20 100 20", "50/10 100, 20 ")(.4), "26/16 100, 20 ");
      },
      "coerces a to a string": function(d4) {
        assert.strictEqual(d4.interpolate({toString: function() { return "1."; }}, "2.")(.5), "1.5");
      }
    },

    "when b is an array": {
      "interpolates each element in b": function(d4) {
        assert.strictEqual(JSON.stringify(d4.interpolate([2, 4], [12, 24])(.4)), "[6,12]");
      },
      "interpolates arrays, even when both a and b are coercible to numbers": function(d4) {
        assert.strictEqual(JSON.stringify(d4.interpolate([2], [12])(.4)), "[6]");
        assert.strictEqual(JSON.stringify(d4.interpolate([[2]], [[12]])(.4)), "[[6]]");
      },
      "reuses the returned array during interpolation": function(d4) {
        var i = d4.interpolate([2], [12]);
        assert.strictEqual(i(.2), i(.4));
      }
    },

    "when b is an object": {
      "interpolates each property in b": function(d4) {
        assert.deepEqual(d4.interpolate({foo: 2, bar: 4}, {foo: 12, bar: 24})(.4), {foo: 6, bar: 12});
      },
      "interpolates arrays, even when both a and b are coercible to numbers": function(d4) {
        var two = new Number(2), twelve = new Number(12);
        two.foo = "2px";
        twelve.foo = "12px";
        assert.deepEqual(d4.interpolate(two, twelve)(.4), {foo: "6px"});
      },
      "reuses the returned object during interpolation": function(d4) {
        var i = d4.interpolate({foo: 2, bar: 4}, {foo: 12, bar: 24});
        assert.strictEqual(i(.2), i(.4));
      }
    },

    "may or may not interpolate between enumerable and non-enumerable properties": function(d4) {
      var a = Object.create({}, {foo: {value: 1, enumerable: true}}),
          b = Object.create({}, {foo: {value: 2, enumerable: false}});
      try {
        assert.deepEqual(d4.interpolate(a, b)(1), {});
      } catch (e) {
        assert.deepEqual(d4.interpolate(a, b)(1), {foo: 2});
      }
      try {
        assert.deepEqual(d4.interpolate(b, a)(1), {});
      } catch (e) {
        assert.deepEqual(d4.interpolate(b, a)(1), {foo: 1});
      }
    },
    "interpolates inherited properties of objects": function(d4) {
      var a = Object.create({foo: 0}),
          b = Object.create({foo: 2});
      assert.deepEqual(d4.interpolate(a, b)(.5), {foo: 1});
    },
    "doesn't interpret properties in the default object's prototype chain as RGB": function(d4) {
      assert.equal(d4.interpolate("hasOwnProperty", "hasOwnProperty")(0), "hasOwnProperty");
    }
  },

  "interpolators": {
    topic: load("interpolate/interpolate").document(),
    "can register a custom interpolator": function(d4) {
      d4.interpolators.push(function(a, b) { return a == "one" && b == "two" && d4.interpolateNumber(1, 2); });
      try {
        assert.equal(d4.interpolate("one", "two")(-.5), .5);
        assert.equal(d4.interpolate("one", "two")(0), 1);
        assert.equal(d4.interpolate("one", "two")(.5), 1.5);
        assert.equal(d4.interpolate("one", "two")(1), 2);
        assert.equal(d4.interpolate("one", "two")(1.5), 2.5);
      } finally {
        d4.interpolators.pop();
      }
    }
  }
});

suite.export(module);
