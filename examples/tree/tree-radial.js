var r = 960 / 2;

var tree = d3.layout.tree()
    .size([360, r - 120])
    .sort(null)
    .children(function(d) { return isNaN(d.value) ? d3.entries(d.value) : null; })
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

var vis = d3.select("#chart").append("svg:svg")
    .attr("width", r * 2)
    .attr("height", r * 2 - 150)
  .append("svg:g")
    .attr("transform", "translate(" + r + "," + r + ")");

d3.json("flare.json", function(json) {
  var nodes = tree(d3.entries(json)[0]);

  var link = vis.selectAll("g.link")
      .data(nodes)
    .enter().append("svg:g")
      .attr("class", "link");

  link.selectAll("line")
      .data(children)
    .enter().append("svg:line")
      .attr("x1", function(d) { return x(d.parent); })
      .attr("y1", function(d) { return y(d.parent); })
      .attr("x2", function(d) { return x(d.child); })
      .attr("y2", function(d) { return y(d.child); });

  var node = vis.selectAll("g.node")
      .data(nodes)
    .enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

  node.append("svg:circle")
      .attr("r", 5);

  node.append("svg:text")
      .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
      .text(function(d) { return d.data.key; });

  // Returns parent+child objects for any children of `d`.
  function children(d) {
    return (d.children || []).map(function(v) {
      return {
        parent: d,
        child: v
      };
    });
  }

  // Radial scales for x and y.
  function x(d) { return d.y * Math.cos((d.x - 90) / 180 * Math.PI); }
  function y(d) { return d.y * Math.sin((d.x - 90) / 180 * Math.PI); }
});