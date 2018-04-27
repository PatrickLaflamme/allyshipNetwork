# Allyship Network Simulation Software

This project was created for the Social Identity Lab by Patrick Laflamme. Broadly speaking, the project can be split into two categories, a *Simulation Code* portion, and a *Network Generation* portion. 

## Dependencies

This project is built almost entirely using javascript, and leverages the following resources

1. [D3.js](D3js.org)
   * To visualize the network during the simulation
   * It also has some useful helper functions to calculate statistics such as mean and sd
 
2. [D3legend.js](http://d3-legend.susielu.com/)
   * To create appealing legends for the visualization

3. [Seedrandom.js](https://github.com/davidbau/seedrandom)
   * To control the seed used to randomly generate the network and assign node identities.
   
4. Some kind of HTTP server. 
   * The simplest HTTP server can be started by navigating to the [Simulation folder](/Simulation), and run the code below in a command terminal. Once the server is up and running, simply navigate to http://localhost:8000. The simulation should start to run in your browser.
   ```
   python -m SimpleHTTPServer 8000
   ```
   
5. [Node.js](nodejs.org)
   * used in the conversion of in-browser simulation to recorded webm videos.

*NOTE*: This software was written primarily for UNIX based systems (mac and linux). While it's possible to run this software in windows, it has not yet been tested, so bugs are likely to exist.

## Simulation Code

The simulation code contains the iternal logic driving the simulation, as well as the code necessary to visualize the simulation. Its intended purpose is to simulate the effect of sexism and allyship in corporate environments. This simulation is gender agnostic, meaning that both genders are assumed as equally likely to show sexist or allyship behaviour. All simulation code can be found in the [Simulation folder](/Simulation).

## Network Generation Code

The Network generation code is relatively simple. It simulates a web browser, loads the localhost:8000 website running the Simulation code, and captures the simulation to video or to images, depending on which script is run. All code necessary to generate videos or still images of the networks can be found in the [network generator folder](/network%20generator).

# Useful Resources

For those who may want to learn more about the tools and techniques used in this project, I recommend that you start first by familiarizing yourself with javascript. The entire simulation is done using vanilla javascript, with no additional modules or external code. As such, being familiar with javascript, its intricacies, and quirks is useful. A good basic intro to javascript can be found [here](https://www.w3schools.com/js/default.asp). 

The network visualization is handled using [d3.js](d3js.org). D3 is a powerful visualization tool, that allows very low level control over the features that are used in visualization. While advanced use of this tool requires knowledge of the [DOM](https://www.w3schools.com/js/js_htmldom.asp), one can get a basic understanding of how it works by completing [tutorials online](https://github.com/d3/d3/wiki/tutorials), and using [examples](https://github.com/d3/d3/wiki/Gallery) as templates.

A very small amount of bash scripting is also done in this project. However, limited knowledge is required in order to effectively use this software. 
