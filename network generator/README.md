# Network Generator

The Network Generator folder consists of some simple tools intended to make it easier to generate videos and still images of the networks created by the simulation. It is generally recommended to access the simulation manually via the browser. In cases where a large number of simulations are desired, it may not be practical to manually set the seed each time. That's when the Network Generator tools are useful.

## Contents

This folder consists of two tools, each made up of multiple files:

* genPics
    - used to generate pictures of networks before and after the simulation. 

* genVids
    - used to generate a video of the simulation.


## Installing dependencies and running the tool(s)

This part of the project uses a server-side javascript tool known as [Node.js](nodejs.org). While only a limited knowledge of the tool is required to run the tools, a more extensive understanding would help in development.

1. Download and install [Node.js](nodejs.org).
2. Open a terminal, navigate to the `network generator` folder, and run `npm install`.
    - This command should create a `node_modules` folder within the `network generator` folder. 
3. Once node has installed all its required packages, you can run either tool with:
`sh runGenPics.sh`
`sh runGenVids.sh`
    - Generated pictures should appear in the "Images" folder.
    - Generated videos should appear in the "Videos" folder.