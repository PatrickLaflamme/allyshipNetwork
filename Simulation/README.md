# Allyship Simulation

This is the folder in which the simulation magic happens. Once an HTTP server is serving this folder, a simulation is easy to run. One simply navigates to the hosted location using a browser, and the simulation will start automatically.

## Getting the simulation ready to run

Since the simulation is run on a 'website', the easiest way to run the simulation is to host in on a server. One can then simply navigate to the web domain on which the simulation is hosted, and it will run automatically. However, this requires some considerable knowledge in order to set up the web server. A simpler way is to host a web server locally on your machine.

To host a web server locally on your machine, one can use the ```SimpleHTTPServer``` function that comes natively with python. To make life easier, one can simply run 'runServer.sh' in the terminal on mac OSX or linux. Click [here](https://apple.stackexchange.com/a/235129) to learn how to run a shell script in mac OSX or linux.

If you are on windows, follow the video instructions [here](https://www.youtube.com/watch?v=tV7TW-iK6GA) to start your python SimpleHTTPServer.

Once your SimpleHTTPServer is running, navigate to http://localhost:8000 to view the simulation.
