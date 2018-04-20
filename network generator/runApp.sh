#! /usr/bin/bash

sh ../Simulation/runServer.sh

for i in `seq 1 $1`; do
	node app.js 1
done
