// Check for the input parameters.
requests = window.location.search.substring(1).split('&')

var query = requests[0];
var allies = requests[1];

// if no specific query (rngSeed) was requested, randomly generate one.
query = query ? query : Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16);
allies = allies == 'true';

// if allies were set to "true", then we will add allies to the simulation, if not, then allies will be neutral instead.
if(allies){
  groupDist = [0.2,0.6,0.2]
} else{
  groupDist = [0.2,0.8,0]
}

var rng = new Math.seedrandom(query);


// network parameters
var num_nodes = 60; // How many nodes in the simulation
var num_links = 200; // How many links in the simulation. This parameter is only used by some network generators.
var num_iters = 100; // How many simulation iterations to perform.
var update_period = 10; // How long to pause between each network update.
var groups = { // this object defines each allyship state. each state has a probability of being chosen, and a an info object. The info object informs the simulation of the name of the state ("sexist", "neutral", "ally"), and how that state behaves in terms of proportions in the following order: (sexist behaviour, neutral behaviour, allyship behaviour).
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
var gender = { // This object defines the two genders, and the likelihood that each gender will appear in the network.
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
var valence_changes = [-5,0.5,5]; // variable that defines the amount of change due to an update

// Generate a random graph given the above parameters. This function is defined in networkSim.js. All of the network generator definitions are in networkGenerator.js. This is where the hierarchicalTeams function comes from.
state = genRandomGraph(num_nodes,num_links, groups, gender, hierarchicalTeams);

// generate a visualization of our random graph on the screen.
viz = plotGraph(state, window.innerWidth, window.innerHeight);

// perform one update of the visualization, allow the nodes to settle.
viz = updateGraph(viz, state);

// simulate on step.
state = simStep(state, valence_changes);

// create an array to store the states at each simulation step.
stats = [];

// create a tracker variable to track our iterations.
iter = 0;

// create all of the variables necessary to convert the svg shown in the browser to a saved video.
var data = [],
    svg = d3.select("svg"),
    canvas = document.createElement("canvas"),
    width = canvas.width = +svg.attr("width"),
    height = canvas.height = +svg.attr("height"),
    context = canvas.getContext("2d"),
    queue = d3.queue(1),
    stream = canvas.captureStream(),
    recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

// set up the video recorder.
recorder.ondataavailable = function(event) {
   if (event.data && event.data.size) {
     data.push(event.data);
   }
 };

// When the video is done, create a link to the csv of the data, and the video itself.
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
};

// Now define the behaviour necessary for the simulation to occur. The setTimeout function will repeat the function inside indefinitely until it's told to stop.
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

// function used to save the stats as a csv file.
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


// function to download the csv file.
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

// function used to convert the frame in the browser to a video frame.
function drawFrame(change, cb) {
  //set the rate at which we update the graph.
  if(change==0){
    state = simStep(state, valence_changes);
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
