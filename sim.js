

var num_nodes = 20;
var num_links = 20;
var groups = {
  sexist: 0.2,
  neutral: 0.5,
  ally: 0.3
}


data = genRandomGraph(num_nodes,num_links, groups);

viz = plotGraph(data, 500, 500);

d3.interval(function () {
  data.links = data.links.map(function(d){d.force = d.force + (Math.random() - 0.5)/10; return d})
  viz = updateGraph(viz, data);
}, 1000);
