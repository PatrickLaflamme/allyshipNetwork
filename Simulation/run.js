

var query = window.location.search.substring(1);

query = query ? query : "12341324";

var rng = new Math.seedrandom(query);

var num_nodes = 60;
var num_links = 200;
var num_iters = 100;
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
    prob:0,
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

viz = plotGraph(data, window.innerWidth, window.innerHeight);
viz = updateGraph(viz, data);
data = simStep(data);
stats = [];
iter = 0;

interval = d3.interval(function (elapsed) {
  data = simStep(data);
  viz = updateGraph(viz, data);
  stats.push(getSummaryStats(data, iter));
  if(iter >= num_iters){
    csvFile = ConvertToCSV(JSON.stringify(stats));
    d3.select("body")
      .append("input")
      .attr("type", "button")
      .attr("value", "Download CSV Summary Statistics")
      .attr("onclick", "download('AllyshipSim-' + query + '.csv', csvFile)")
    interval.stop();
  }
  iter++
}, pause_time, 10000);

function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var line = '';

    var header = Object.getOwnPropertyNames(array[0]);

    for(var i=0; i < header.length;i++){
      if (line != '') line += ','

      line += header[i];
    }

    str += line + '\r\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
