/*
  Function devoted to generating the nodes and links required for the simulation to run.
  Parameters:
    -
    -
    -
    -
    -

  Returns:
    - Object with two values:
      - nodes - the list of nodes in the network
      - links - the list of links that connect nodes

*/
function genRandomGraph(num_nodes, num_links, groupProbs, genderProbs, linkGenerator){
  nodes = d3.range(num_nodes).map(function(d,i){ return {r: 200,
                                                       gender: assignGroup(genderProbs).gender,
                                                       group: assignGroup(groupProbs),
                                                       index: i}});
  links = linkGenerator(nodes)

  return {nodes: nodes, links: links}
}


/*
  This function is devoted to simulating one "timestep" within the organization. It modifies the valence of the individuals based on the types of people they are surrounded by:
    - Sexist people of the opposite gender reduce valence
    - Neutral people of either gender increase value margninally
    - Allies increase values considerably.

  In addition, we modify the effect of a connection based on a person's position in the network. That is, we multiply the overall change in a person's valence by the proportion of connections that are of the other gender and are not allies.
*/
function simStep(data){

  var force_changes = [-10,0.5,10];

  // Go through and calculate the new valence of each person in the network
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

// Generic function to return an index given an array of probabilities that sum to 1.
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

/*
  Function devoted to calculating meaningful summary statistics for the network after the simulation has run its course. This is used to test the network from an analytical perspective.
*/
function getSummaryStats(data){
  WomenLinks = []
  WomenNodes = data.nodes.filter(function(d){ return d.gender == 'Woman'})
  MenLinks = []
  MenNodes = data.nodes.filter(function(d){ return d.gender == 'Man'})

  data.links.forEach(function(d){
    if(d.source.gender == "Woman"){
      WomenLinks.push(d.force);
    }
    else{
      MenLinks.push(d.force);
    }

    if(d.target.gender == 'Woman'){
      WomenLinks.push(d.force);
    }
    else{
      MenLinks.push(d.force);
    }
  });

  return {
    meanWomenForce: d3.mean(WomenLinks),
    meanMenForce: d3.mean(MenLinks),
    meanWomenRad: d3.mean(WomenNodes, function(d){return d.r}),
    meanMenRad: d3.mean(MenNodes, function(d){return d.r}),
  }


}
