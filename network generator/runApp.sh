#! /usr/bin/bash

for i in `seq 1 $1`; do
	node app.js 1
done
