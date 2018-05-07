# Allyship Simulation

This is the folder in which the simulation magic happens. Once an HTTP server is serving this folder, a simulation is easy to run. One simply navigates to the hosted location using a browser, and the simulation will start automatically.

## Getting the simulation ready to run

Since the simulation is run on a 'website', the easiest way to run the simulation is to host in on a server. One can then simply navigate to the web domain on which the simulation is hosted, and it will run automatically. However, this requires some considerable knowledge in order to set up the web server. A simpler way is to host a web server locally on your machine.

To host a web server locally on your machine, one can use the ```SimpleHTTPServer``` function that comes natively with python. To make life easier, one can simply run 'runServer.sh' in the terminal on mac OSX or linux. Click [here](https://apple.stackexchange.com/a/235129) to learn how to run a shell script in mac OSX or linux.

If you are on windows, follow the video instructions [here](https://www.youtube.com/watch?v=tV7TW-iK6GA) to start your python SimpleHTTPServer.

Once your SimpleHTTPServer is running, navigate to http://localhost:8000 to view the simulation.

## How it works

This simulation project can broadly be broken down into 3 pieces, each of which is tackled by functions in a respective .js file:

1. [Generating a randomized network](#generating-a-randomized-network), which is largely handled by the random network generation approaches defined in [networkGenerators.js](/Simulation/NetworkGenerators.js).

2. [Simulating changes in the network](#simulating-the-network) at each step of the simulation. This is handled by the functions defined in [networkSim.js](/Simulation/networkSim.js). 

3. [Visualizing the network](#visualizing-the-network) throughout the simulation. This is handled by the functions defined in [networkViz.js](/Simulation/networkViz.js).


### Generating a randomized network

There are a number of approaches to generating a random network that were explored during development. Each approach was created in a distinct function.

* `myRandomGraph` defines a crude, initial network generator that simply subsamples the collection of all possible links between nodes. 

* `DorogovtsevMendesGenerator` defines an implementation of the [Dorogovtsev Mendes](http://graphstream-project.org/doc/Generators/Dorogovtsev-Mendes-generator/) graph generating algorithm.

* `FullyConnected` defines a simple approach of connected all nodes in the graph.

* `HierarchicalTeams` generates a hierarchy of fully connected teams. This is the approach currently used in the simulation.

This section of the project is distinct from the other two in that it's much more abstract. None of the functions within the [networkGenerators.js](/Simulation/NetworkGenerators.js) file are directly related to the simulation, but are rather helper functions to define a network. Since the shape of the network presumably has a significant impact on the outcome, it was decided that this portion of the project should be kept separate and distinct from the rest.

### Simulating the network

The simulation portion of this project also seemed to be divisible. First, we must generate an initial state for the network, and then we must iteratively update the state of the network based upon a defined set of rules. We will discuss how the simulation works, in that order.

To generate an initial state of the network, the `genRandomGraph` function takes a number of parameters, defined in [networkSim.js](/Simulation/networkSim.js), and creates a graph to be used in the simulation, in the form of an object with two values: 

* `nodes`, which is an array of all the nodes in the graph. At the beginning of the simulation, each node is assigned an initial valence score of 100, saved in the node object's `node.r` parameter.

* `links`, which is an array of all of the connections between nodes in the graph. All of these links are given a default 'force' of 100. However, this 'force' is not updated during the simulation.

Simulating a time step is easy. Simply feed the output of `genRandomGraph` into the `simStep` function, along with a `valence_changes` array, that controls how the network will change based off of a sexist, neutral, or ally interaction, respectively. `value_changes` is an array of 3 numbers, which must add to 1, that is of the form: \["valence change due to a sexist comment", "valence change due to a neutral comment", "valence change due to an allied comment"\]. 

The updates are made as follows:

* Linked ally nodes of another gender will increase a node's valence, by the given formula:

![img](http://www.sciweavers.org/tex2img.php?eq=%20\Delta_{valence}%20%3D%20{Valence%20Change%20Due%20To%20Ally}*%20\frac{Number%20Of%20Neighbour%20NonAllies%20Of%20The%20Other%20Gender}{Number%20Of%20Neighbours}&bc=White&fc=Black&im=jpg&fs=12&ff=arev&edit=0)

* Linked neutral nodes will increase a node's valence slightly.

* Linked sexist nodes will drastically decrease a node's valence, by the given formula:
![img](http://www.sciweavers.org/tex2img.php?eq=%20\Delta_{valence}%20%3D%20{Valence%20Change%20Due%20To%20Sexist}*%20\frac{Number%20Of%20Neighbour%20NonAllies%20Of%20The%20Other%20Gender}{Number%20Of%20Neighbours}&bc=White&fc=Black&im=jpg&fs=12&ff=arev&edit=00)

After each time step, we also generate some summary statistics, defined in `getSummaryStats`. 

### Visualizing the network

To visualize the network, we leverage the d3 force layout tool, which allows us to quickly and easily visualize complex graphs defined by the force layout graph visualization algorithm.

* Shapes define the group of a node (sexist, neutral, or ally)

* Colours define the gender of the node (Man, or Woman)

* The lines are the connections between nodes. If two nodes are not connected by a line, then they are not interacting throughout the simulation.
