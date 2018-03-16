var async = require('async');
var Browser = require('zombie');
var randomstring = require("randomstring");

var browserOpts = {
  runScripts: false,
  site: 'http://localhost:8000/Simulation
};

var home = new Browser(browserOpts);
