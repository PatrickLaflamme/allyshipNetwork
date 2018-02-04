function genRandomGraph(num_nodes, num_links, groupProbs, genderProbs){
  nodes = d3.range(num_nodes).map(function(d){ return {r: 5,
                                                       sex: assignGroup(genderProbs).sex,
                                                       group: assignGroup(groupProbs)}});
  links = getRandomSubarray(allPairs(nodes), num_links);

  arr = []

  for(i=0; i < links.length; i++){

    arr.push(links[i].source);
    arr.push(links[i].target);
  }

  empty_nodes = nodes.filter(function(d, i){
    for(n=0; n<arr.length; n++){
      if(arr && i==arr[n]){return false;}
    };
    return true;
  });

  for(n=0; n<empty_nodes.length; n++){
    while(true){
      target = ~~d3.randomUniform(num_nodes)();
      if(target!=n){
        break;
      }
    }
    links.push({source:empty_nodes[n], target:target, force: 0.1})
  }

  return {nodes: nodes, links: links}
}

function allPairs (nodes){ // generate every unique pair of nodes.
  pairArray = [];
  for(i=0; i < nodes.length; i++){
    for(j=i; j < nodes.length; j++){
      pairArray.push({source: i, target: j, force: 0.1});
    };
  };
  return pairArray;
}

function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i-- > 0) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

function assignGroup(groupProbs){

  console.assert(d3.sum(groupProbs, function(d){ d.prob}) == 1.0, "Warning: the group probabilities do not sum to 1");


  n = Math.random();
  keys = Object.keys(groupProbs);
  total_prob = 0;

  for(i=0;i < keys.length; i++){
    total_prob += groupProbs[keys[i]].prob;
    if(n <= total_prob){
      return groupProbs[keys[i]].info;
    }
  }
}

function get_force_change(statementProbs){
  n = Math.random();
  total_prob = 0;

  for(i=0;i < statementProbs.length; i++){
    total_prob += statementProbs[i];
    if(n <= total_prob){
      return i;
    }
  }
}

function simStep(data){

  var force_changes = [-0.005,0,0.0001];

  var nodes = data.nodes;

  data.links = data.links.map(function(d){

    force_change = force_changes[get_force_change(d.target.group.prob)];
    force_change += force_changes[get_force_change(d.source.group.prob)];

    if(d.target.sex == d.source.sex){
      force_change = 0
    }

    d.force += force_change;

    if(Math.abs(d.force) > 0.15){
      d.force = Math.sign(d.force)*0.15
    }

    return d;
  });

  return data;

}
