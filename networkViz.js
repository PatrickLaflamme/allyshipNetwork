
function plotGraph(data, width, height) {

        var svg = d3.select("body").append("svg");

        svg.attr("width", width)
          .attr("height", height);


        linkForce =  d3.forceLink()
                       .distance(function(d){return 10^-(1000*d.force) + 200})
                       .iterations(10)
                       .id(function(d){ return d.index })


        var simulation = d3.forceSimulation()
            .force("link", linkForce)
            .force("charge", d3.forceManyBody().strength(-800))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("y", d3.forceY(0))
            .force("x", d3.forceX(0))

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .attr("stroke", "black")
            .attr("stroke-width", function(d){ return Math.abs(d.force*12)})
            .attr("opacity",0.6);

        var triangle = d3.symbol()
                       .size(function(d){return 100})
                       .type(d3.symbolTriangle)();
        var square = d3.symbol()
                       .size(function(d){return 100})
                       .type(d3.symbolSquare)();
        var circle = d3.symbol()
                       .size(function(d){return 100})
                       .type(d3.symbolCircle)();

        var symbolScale = d3.scaleOrdinal()
                            .domain(["Ally", "Neutral", "Sexist"])
                            .range([circle, square, triangle]);

        var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
                           .domain(["Man", "Woman"]);

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("path")
            .data(data.nodes.sort(function(x,y){ return d3.ascending(x.gender, y.gender)}))
            .enter().append("path")
            .attr("d", function(d){ return symbolScale(d.group.name);})
            .style("fill", function(d){ return colorScale(d.gender)})
            .style("stroke", "black")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        /*
        svg.append("g")
          .attr("class", "legendSymbol")
          .attr("transform", "translate(20, 20)");


        var legendPath = d3.legendSymbol()
          .scale(symbolScale)
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
                .attr("x1", function(d) { return d.source.x = Math.max(d.source.r, Math.min(width - d.source.r, d.source.x)); })
                .attr("y1", function(d) { return d.source.y = Math.max(d.source.r, Math.min(width - d.source.r, d.source.y)); })
                .attr("x2", function(d) { return d.target.x = Math.max(d.target.r, Math.min(width - d.target.r, d.target.x)); })
                .attr("y2", function(d) { return d.target.y = Math.max(d.target.r, Math.min(width - d.target.r, d.target.y)); });

            node
                .attr("transform", function(d) {
                                      d.x = Math.max(d.r, Math.min(width - d.r, d.x));
                                      d.y = Math.max(d.r, Math.min(height - d.r, d.y));
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

        return {sim: simulation, links: link}

    }

function updateGraph(viz, data){

  viz.sim.force("link")
         .links(data.links);

  viz.sim.nodes(data.nodes);

  viz.links.attr("stroke-width", function(d){ return Math.abs(d.force*12)})
           .attr("stroke", function(d){ if(d.force>=0){ return "black"} else {return "red"}});

  viz.sim = viz.sim.alpha(0.1).restart();

  return viz
}
