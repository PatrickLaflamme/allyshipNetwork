var rng = Math.random; //new Math.seedrandom('1-2039481234-0');


function genRandomGraph(num_nodes, num_links, groupProbs, genderProbs, linkGenerator){
  nodes = d3.range(num_nodes).map(function(d){ return {r: 5,
                                                       gender: assignGroup(genderProbs).gender,
                                                       group: assignGroup(groupProbs)}});
  links = linkGenerator(nodes)

  function assignGroup(groupProbs){

    console.assert(d3.sum(groupProbs, function(d){ d.prob}) == 1.0, "Warning: the group probabilities do not sum to 1");


    n = rng();
    keys = Object.keys(groupProbs);
    total_prob = 0;

    for(i=0;i < keys.length; i++){
      total_prob += groupProbs[keys[i]].prob;
      if(n <= total_prob){
        return groupProbs[keys[i]].info;
      }
    }
  }


  return {nodes: nodes, links: links}
}

function get_force_change(statementProbs){
  n = rng();
  total_prob = 0;

  for(i=0;i < statementProbs.length; i++){
    total_prob += statementProbs[i];
    if(n <= total_prob){
      return i;
    }
  }
}

function simStep(data){

  var force_changes = [-0.05,0,0.05];

  var nodes = data.nodes;

  data.links = data.links.map(function(d){

    force_change = force_changes[get_force_change(d.target.group.prob)];
    force_change += force_changes[get_force_change(d.source.group.prob)];

    targetLinks = data.links.filter(function(d2){
      if(d2.target == d.target || d2.target == d.source || d2.source == d.target || d2.source == d.source){
        return true
      }
      else{
        return false
      }
    })

    sourceLinks = data.links.filter(function(d2){
      if(d2.target == d.target || d2.target == d.source || d2.source == d.target || d2.source == d.source){
        return true
      }
      else{
        return false
      }
    })

    if(d.target.gender == d.source.gender){
      force_change = 0
    }

    d.force += force_change;

    /*if(Math.abs(d.force) > 0.15){
      d.force = Math.sign(d.force)*0.15
    }*/

    return d;
  });

  return data;

}

function getSummaryStats(data){
  WomenLinks = []
  WomenNodes = []
  MenLinks = []
  MenNodes = []

  data.links.forEach(function(d){
    if(d.source.gender == "Woman"){
      WomenLinks.push(d.force);
      WomenNodes.push({x: d.source.x, y: d.source.y});
    }
    else{
      MenLinks.push(d.force);
      MenNodes.push({x: d.source.x, y: d.source.y});
    }

    if(d.target.gender == 'Woman'){
      WomenLinks.push(d.force);
      WomenNodes.push({x: d.target.x, y: d.target.y});
    }
    else{
      MenLinks.push(d.force);
      MenNodes.push({x: d.target.x, y: d.target.y});
    }
  });

  return {
    meanWomenForce: d3.mean(WomenLinks),
    meanMenForce: d3.mean(MenLinks),
    meanWomenDist: d3.mean(WomenNodes, function(d){return Math.sqrt(Math.pow(d.x - window.innerWidth/2,2) + Math.pow(d.y - (window.innerHeight - 20)/2,2))}),
    meanMenDist: d3.mean(MenNodes, function(d){return Math.sqrt(Math.pow(d.x - window.innerWidth/2,2) + Math.pow(d.y - (window.innerHeight - 20)/2,2))}),
  }


}
