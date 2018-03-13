

var num_nodes = 30;
var num_links = 200;
var num_iters = 10;
var pause_time = 100;
var groups = {
  sexist: {
    prob:0.2,
    info:{
      name: "Sexist",
      prob: [1,0,0]
    }},
  neutral: {
    prob:0.8,
    info:{
      name: "Neutral",
      prob: [0,1,0]
    }},
  ally: {
    prob:0.0,
    info:{
      name: "Ally",
      prob: [0,0,1]
    }},
}
var gender = {
  Man: {
    prob: 0.8,
    info: {
      gender: "Man"
    }
  },
  Woman: {
    prob: 0.2,
    info: {
      gender: "Woman"
    }
  }
}

data = genRandomGraph(num_nodes,num_links, groups, gender, hierarchicalTeams);

viz = plotGraph(data, window.innerWidth, window.innerHeight - 20);
viz = updateGraph(viz, data);
data = simStep(data);

//setTimeout(function(){initial_stats = getSummaryStats(data);},1000);

interval = d3.interval(function (elapsed) {
  data = simStep(data);
  viz = updateGraph(viz, data);
  if(elapsed >= num_iters*pause_time){
    final_stats = getSummaryStats(data);
    interval.stop();
  }
}, pause_time, 1000);
