
function plotGraph(data, width, height) {

        var svg = d3.select("body").append("svg");

        svg.attr("width", width)
          .attr("height", height)
          .attr("id", "AllyshipSim");


        linkForce =  d3.forceLink()
                       .distance(function(d){return d.force})
                       .iterations(10)
                       .id(function(d){ return d.index })

        var simulation = d3.forceSimulation()
            .force("link", linkForce)
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2))

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .attr("stroke", "black")
            .attr("stroke-width", function(d){ return 1})
            .attr("opacity",0.6);

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

        var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
                           .domain(["Man", "Woman"]);

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


        svg.append("g")
          .attr("class", "legendSymbol")
          .attr("transform", "translate(20, 20)");


        /*var legendPath = d3.legendSymbol()
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

*/
        var ticked = function() {
            link
                .attr("x1", function(d) { return d.source.x = Math.max(50, Math.min(width - 50, d.source.x)); })
                .attr("y1", function(d) { return d.source.y = Math.max(50, Math.min(height - 50, d.source.y)); })
                .attr("x2", function(d) { return d.target.x = Math.max(50, Math.min(width - 50, d.target.x)); })
                .attr("y2", function(d) { return d.target.y = Math.max(50, Math.min(height - 50, d.target.y)); });

            node
                .attr("transform", function(d) {
                                      d.x = Math.max(50, Math.min(width - 50, d.x));
                                      d.y = Math.max(50, Math.min(height - 50, d.y));
                                      return "translate(" + d.x + "," + d.y + ")";
                                   })
        }

        simulation
            .nodes(data.nodes)
            .on("tick", ticked);

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

        return {sim: simulation, links: link, nodes: node, symbolScale: symbolScale}

    }

function updateGraph(viz, data){

  /*viz.sim.force("link")
         .links(data.links);

  viz.sim = viz.sim.alpha(1).restart();

  viz.sim.nodes(data.nodes);
*/
  //viz.links.attr("stroke-width", function(d){ return Math.abs(d.force/90)})
  //         .attr("stroke", function(d){ if(d.force>=0){ return "black"} else {return "red"}});

  viz.nodes.attr("d", function(d){ return viz.symbolScale(d.group.name)(d);})

  return viz
}
