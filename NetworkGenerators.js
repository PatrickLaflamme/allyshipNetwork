
function myRandomGraph(nodes) {

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

  return links;

}

function DorogovtsevMendesGenerator(nodes){
  [included_nodes, remaining_nodes] = getRandomSubarray(nodes, 3, true);

  links = allPairs(included_nodes);

  for(i=0; i<remaining_nodes.length; i++){
    included_nodes.push(remaining_nodes[i]);

    new_link_targets = []

    while(true){
      newlink = Math.floor(rng()*included_nodes.length);

      if(!new_link_targets.includes(newlink)){
        new_link_targets.push(newlink);

        links.push({source: i+3, target: newlink, force: 0.1});
      }

      if(new_link_targets.length > 1){
        break;
      }
    }
  }

  return links
}

function hierarchicalTeams(nodes){

  clusterSizes = [4,5,6,7,8]

  nodeList = [...nodes]

  clusters = Array()

  // Split our list of nodes into clusters
  while(nodeList.length > 0){
    clusterSize = clusterSizes[Math.floor(rng()*clusterSizes.length)]
    nodesInCluster = nodeList.splice(0,clusterSize - 1)
    fcCluster = fullyConnected(nodesInCluster)
    clusters.push({links:fcCluster, nodes: nodesInCluster})
  }

  managers = []

  // create a fully connected network within clusters, and connect one node from each cluster (the manager) to all other managers from the other clusters.
  for(i=0;i<clusters.length;i++){
    cluster = clusters[i].links
    nodes = [...clusters[i].nodes]

    if(i == 0){
      pairArray = cluster
    }
    else{
      pairArray = pairArray.concat(cluster);
    }

    managers.push(nodes[0])
  }

  managerConnections = fullyConnected(managers)

  pairArray = pairArray.concat(managerConnections)

  return pairArray
}

function fullyConnected(nodes) {
  return allPairs(nodes)
}


// HELPER FUNCTIONS

function allPairs (nodeList){ // generate every unique pair of nodes.
  pairs = [];
  for(i=0; i < nodeList.length; i++){
    for(j=i+1; j < nodeList.length; j++){
      pairs.push({source: nodeList[i], target: nodeList[j], force: 100});
    };
  };
  return pairs;
}

function getRandomSubarray(arr, size, remainder) { // get a random subset of the array of length size.

    remainder = remainder || false;

    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i-- > 0) {
        index = Math.floor((i + 1) * rng());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }

    if(remainder){
      return [shuffled.slice(0, size), shuffled.slice(size)]
    }
    return shuffled.slice(0, size);
}
