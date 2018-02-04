

var num_nodes = 20;
var num_links = 20;
var groups = {
  sexist: 0.2,
  neutral: 0.5,
  ally: 0.3
}


data = genRandomGraph(num_nodes,num_links, groups);

plotGraph(data, 500, 500);
