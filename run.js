

var num_nodes = 20;
var num_links = 50;
var num_iters = 40;
var pause_time = 500;
var groups = {
  sexist: {
    prob:0.25,
    info:{
      name: "Sexist",
      prob: [1,0,0]
    }},
  neutral: {
    prob:0.75,
    info:{
      name: "Neutral",
      prob: [0,1,0]
    }},
  ally: {
    prob:0,
    info:{
      name: "Ally",
      prob: [0,0,1]
    }},
}
var sex = {
  male: {
    prob: 0.8,
    info: {
      sex: "Male"
    }
  },
  female: {
    prob: 0.2,
    info: {
      sex: "Female"
    }
  }
}

data = genRandomGraph(num_nodes,num_links, groups, sex);

viz = plotGraph(data, 500, 500);

interval = d3.interval(function (elapsed) {
  data = simStep(data);
  viz = updateGraph(viz, data);
  if(elapsed >= num_iters*pause_time){
    interval.stop();
  }
}, pause_time);
