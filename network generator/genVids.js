/*
NOTE: this code is extremely unstable, and may need to be re-run
multiple times before you can record all desired random seeds. 
*/


const Nightmare = require('nightmare');
require('nightmare-inline-download')(Nightmare);

//set random seeds we want to generate videos for.
queries = [
  'osltFpbuDo6sEMJB',
  'RE0QRkb6hoEx87BB',
  'O81J2xbjrAIa6QkM',
  '20Kd65GlUC2CIkip',
  '8abzLhBpM1or48tl',
  'g2ULKrZQZ2yFxz93',
  'uWOtG9YSXJtPmIfa',
  'Ke6Piii6gplcn21b',
  'jDayjkMzzSeBQxjt',
  'DUrWkoKHmRHX1qJl',
  'rYBVFj6Zs1F2EuVA',
]

searchBuilds = []

// put a with and without allies simulation into our queue.
queries.forEach((q)=>{
  searchBuilds.push(q+"&true");
  searchBuilds.push(q+"&false");
})


var nightmare = []
var j = 0

// simulate and record each simulation.
for(i=0;i<searchBuilds.length;i++){

  setTimeout(()=>{

      nightmare = new Nightmare({ show: false, height: 1080, width:1920, paths:{downloads: "/Users/patricklaflamme/Dropbox/AllyshipNetwork/network\ generator/Videos/"}, waitTimeout: 100000});

      nightmare
          .goto('http://localhost:8000/Simulation/?'+ searchBuilds[j])
          .viewport(1920,1080)
          .wait('a')
          .click("a")
          .download()
          .click("input")
          .download()
          .wait(10000)
          .end()
          .catch(e => console.log(e))
          .then(() => {
            console.log("Downloaded " + searchBuilds[j]);
            j++
          })
          .catch(e => console.log(e))
        }, i*100000);


}

