# Allyship Network Simulation Software

This project was created for the Social Identity Lab. Broadly speaking, the project can be split into two categories, a *Simulation Code* portion, and a *Network Generation* portion. 

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


## Simulation Code

The simulation code contains the iternal logic driving the simulation, as well as the code necessary to visualize the simulation. Its intended purpose is to simulate the effect of sexism and allyship in simulated corporate environments. This simulation is gender agnostic, meaning that both genders are assumed to be equally likely to be sexist or allies. All simulation code can be found in the [Simulation folder](/Simulation).

### Running the simulation code

## Network Generation Code

The Network generation code is relatively simple. It simulates a web browser, loads the localhost:8000 website running the Simulation code, and captures the simulation to video or to images, depending on which script is run.

### Running the network generation code.
