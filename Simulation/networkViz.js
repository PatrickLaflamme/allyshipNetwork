// function to initially plot the randomly generated graph.
function plotGraph(data, width, height) {
        
        // add an svg to the web page.
        var svg = d3.select("body").append("svg");
        svg.attr("width", width)
          .attr("height", height)
          .attr("id", "AllyshipSim")
          .style("background-color",'white');

        // define the force associated with each link. THis will affect how far apart the nodes are from each other.
        linkForce =  d3.forceLink()
                       .distance(function(d){return d.force})
                       .iterations(10)
                       .id(function(d){ return d.index })
        
        // Define the forces at play in the simulation. It's probably best to leave these unchanged unless you've read the d3 docs.
        var simulation = d3.forceSimulation()
            .force("link", linkForce)
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2))
        
        // add the lines connecting the nodes.
        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .attr("stroke", "black")
            .attr("stroke-width", function(d){ return 1})
            .attr("opacity",0.6);
        
        // define the shapes of our three node types: triangle for sexist, square for neutral, circle for ally.
        var triangle = d3.symbol()
                       .size(function(d){return Math.max(10, d.r)})
                       .type(d3.symbolTriangle);
        var square = d3.symbol()
                       .size(function(d){return Math.max(10, d.r)})
                       .type(d3.symbolSquare);
        var circle = d3.symbol()
                       .size(function(d){return Math.max(10, d.r)})
                       .type(d3.symbolCircle);
        
        var symbolScale = d3.scaleOrdinal()
                            .domain(["Ally", "Neutral", "Sexist"])
                            .range([circle, square, triangle]);

        var symbolScaleLegend = d3.scaleOrdinal()
                            .domain(["Ally", "Neutral", "Sexist"])
                            .range([circle({r:100}), square({r:100}), triangle({r:100})]);
        
        // define the two colours for the two genders.
        var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
                           .domain(["Man", "Woman"]);
        
        // now add the nodes to the plot.
        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("path")
            .data(data.nodes.sort(function(x,y){ return d3.ascending(x.gender, y.gender)}))
            .enter().append("path")
            .attr("id", function(d){ return d.index})
            .attr("d", function(d){ return symbolScale(d.group.name)(d);})
            .style("fill", function(d){ return colorScale(d.gender)})
            .style("stroke", "black")
            .call(d3.drag()
                    .on("start", dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended))

        // Here we add each fo the legends.
        svg.append("g")
          .attr("class", "legendSymbol")
          .attr("transform", "translate(20, 20)");

        var legendPath = d3.legendSymbol()
          .scale(symbolScaleLegend)
          .orient("vertical")
          .labelWrap(30)
          .title("Sexism level")
          .on("cellclick", function(d){alert("clicked " + d);});

        svg.select(".legendSymbol")
          .call(legendPath);

        svg.append("g")
          .attr("class", "legendColor")
          .attr("transform", "translate(20,120)");

        var legendColor = d3.legendColor()
          .shape("path", d3.symbol().type(d3.symbolSquare).size(150)())
          .shapePadding(10)
          .title("Gender")
          .scale(colorScale);

        svg.select(".legendColor")
          .call(legendColor);
        
        // This function defines how the netowrk updates. This allows the nodes to settle into a pattern on the screen that's easier to interpret.
        var ticked = function() {
                // here wer define a limit to the locations the links can go, so that they never leave the canvas we've created.
            link
                .attr("x1", function(d) { return d.source.x = Math.max(115, Math.min(width - 50, d.source.x)); })
                .attr("y1", function(d) { return d.source.y = Math.max(50, Math.min(height - 50, d.source.y)); })
                .attr("x2", function(d) { return d.target.x = Math.max(115, Math.min(width - 50, d.target.x)); })
                .attr("y2", function(d) { return d.target.y = Math.max(50, Math.min(height - 50, d.target.y)); });
                // we do the same here for the nodes. Thsi way, they won't disappear off the screen.
            node
                .attr("transform", function(d) {
                                      d.x = Math.max(115, Math.min(width - 50, d.x));
                                      d.y = Math.max(50, Math.min(height - 50, d.y));
                                      return "translate(" + d.x + "," + d.y + ")";
                                   })
        }

        simulation
            .nodes(data.nodes)
            .on("tick", ticked);
        // now officially define the simulation.
        sim = simulation.force("link")
                        .links(data.links);



        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        // return all the info necessary to update the plot after a simulation step.
        return {sim: simulation, links: link, nodes: node, symbolScale: symbolScale}

    }


// This function will update the graph based on the changes to the data due to a simulation step. viz is the output from the plotGraph, or updateGraph functions. 'data' is the output from a simStep or genRandomGraph funtion.
function updateGraph(viz, data){

  viz.nodes.attr("d", function(d){ return viz.symbolScale(d.group.name)(d);})

  return viz
}
