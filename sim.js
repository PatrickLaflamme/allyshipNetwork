

var num_nodes = 20;
var num_links = 35;
var groups = {
  sexist: {
    prob:0.2,
    info:{
      name: "sexist",
      prob: [0.5,0.3,0.2]
    }},
  neutral: {
    prob:0.5,
    info:{
      name: "neutral",
      prob: [0.25,0.5,0.25]
    }},
  ally: {
    prob:0.2,
    info:{
      name: "ally",
      prob: [0.2,0.3,0.5]
    }},
}

data = genRandomGraph(num_nodes,num_links, groups);

viz = plotGraph(data, 500, 500);

d3.interval(function () {
  data.links = data.links.map(function(d){d.force = d.force + (Math.random() - 0.5)/50; return d})
  viz = updateGraph(viz, data);
}, 1000);
