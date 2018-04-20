requests = window.location.search.substring(1).split('&')

var query = requests[0];
var allies = requests[1];

query = query ? query : "12341324";
allies = allies == 'true';

if(allies){
  groupDist = [0.2,0.6,0.2]
} else{
  groupDist = [0.2,0.8,0]
}

var rng = new Math.seedrandom(query);

var num_nodes = 60;
var num_links = 200;
var num_iters = 100;
var update_period = 10;
var groups = {
  sexist: {
    prob:groupDist[0],
    info:{
      name: "Sexist",
      prob: [1,0,0]
    }},
  neutral: {
    prob:groupDist[1],
    info:{
      name: "Neutral",
      prob: [0,1,0]
    }},
  ally: {
    prob:groupDist[2],
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

state = genRandomGraph(num_nodes,num_links, groups, gender, hierarchicalTeams);

viz = plotGraph(state, window.innerWidth, window.innerHeight);
viz = updateGraph(viz, state);
state = simStep(state);
stats = [];
iter = 0;

/*interval = d3.interval(function (elapsed) {
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
}, pause_time, 1000);*/

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

var data = [],
    svg = d3.select("svg"),
    canvas = document.createElement("canvas"),
    width = canvas.width = +svg.attr("width"),
    height = canvas.height = +svg.attr("height"),
    context = canvas.getContext("2d"),
    queue = d3.queue(1),
    stream = canvas.captureStream(),
    recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

recorder.ondataavailable = function(event) {
   if (event.data && event.data.size) {
     data.push(event.data);
   }
 };

recorder.onstop = () => {
   var url = URL.createObjectURL(new Blob(data, { type: "video/webm" }));
   d3.selectAll("canvas, svg").remove();
   csvFile = ConvertToCSV(JSON.stringify(stats));

    if(allies){
      end = "-Allies"
    } else {
      end = "-noAllies"
    }

   d3.select("body")
     .append("input")
     .attr("type", "button")
     .attr("value", "Download CSV Summary Statistics")
     .attr("onclick", "download('AllyshipSim-' + query + end + '.csv', csvFile)")

   d3.select("body")
     .append('a')
     .attr("id","vidLink")
     .attr("href", url)
     .attr("download", query + end + ".webm")
     .text("Click here to download the video")

   /*d3.select("body")
     .append("video")
     .attr("id","finalVid")
     .attr("src", url)
     .attr("controls", true);*/
};

setTimeout(()=>{
  d3.range(num_iters*update_period).forEach(function(frame){
    queue.defer(drawFrame, frame % update_period);
  });

  queue.awaitAll(function(err, frames){
    recorder.start();
    drawFrame();

    function drawFrame() {
      if (frames.length) {
        context.drawImage(frames.shift(), 0, 0, width, height);
        requestAnimationFrame(drawFrame);
      } else {
        recorder.stop();
      }
    }
  });
}, 2000)

function drawFrame(change, cb) {
  //set the rate at which we update the graph.
  if(change==0){
    state = simStep(state);
    viz = updateGraph(viz, state);
    stats.push(getSummaryStats(state, iter));
  }

  var img = new Image(),
      serialized = new XMLSerializer().serializeToString(svg.node()),
      url = URL.createObjectURL(new Blob([serialized], {type: "image/svg+xml"}));
  img.onload = function(){
    cb(null, img);
  };
  img.src = url;
}
