var rng = Math.random; //new Math.seedrandom('1-2039481234-0');


function genRandomGraph(num_nodes, num_links, groupProbs, genderProbs, linkGenerator){
  nodes = d3.range(num_nodes).map(function(d,i){ return {r: 100,
                                                       gender: assignGroup(genderProbs).gender,
                                                       group: assignGroup(groupProbs),
                                                       index: i}});
  links = linkGenerator(nodes)

  return {nodes: nodes, links: links}
}


function simStep(data){

  var force_changes = [-5,0.5,5];

  var nodes = data.nodes;

  data.nodes = data.nodes.map(function(d){

    relLinks = data.links.filter(function(link){return d == link.target || d == link.source});


    nOtherGenderNotAlly = d3.sum(relLinks, function(link){
      if(d == link.target && d.gender != link.source.gender && link.source.group.name != "Ally"){
        return 1;
      }
      if(d == link.source && d.gender != link.target.gender && link.target.group.name != "Ally"){
        return 1;
      }
      else{
        return 0;
      }
    })

    change_multiplier = nOtherGenderNotAlly/relLinks.length;

    relLinks.forEach(function(links){
      if(d == links.target){
        node = links.source
      }
      else{
        node = links.target
      }
      if(node.gender != d.gender){
        change = force_changes[get_force_change(node.group.prob)];
      }
      else{
        change = force_changes[1];
        change_multiplier = 1;
      }
      d.r += change*change_multiplier;
    })

    d.r = Math.max(30,d.r)

    return d;
  })

  return data;

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

function assignGroup(groupProbs){

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
