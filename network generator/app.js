const Nightmare = require('nightmare')
var randomstring = require("randomstring");
const svg2png = require("svg2png");
var fs = require("fs");

var nImages = process.argv[2];

random = []

for(i=0;i<nImages;i++){
  random.push(randomstring.generate(16));
}

var nightmare = []
var j = 0

for(i=0;i<nImages;i++){
  nightmare = new Nightmare({ show: false})

  svg = nightmare
          .goto('http://localhost:8000/Simulation/?'+random[j])
          .wait(1000)
          .evaluate(() => document.querySelector("svg").outerHTML)
          .end()
          .then(svg => {
            svg2png(svg, {width: 1920, height: 1080})
              .then(buffer => {
                console.log(random[j])
                fs.writeFile("Images/"+random[j]+".png", buffer, error => {if(error){console.log(error)}})
                j++
              })
              .catch(e => console.log(e))
          })
          .catch(e => console.log(e))


}
