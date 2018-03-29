const Nightmare = require('nightmare');
require('nightmare-inline-download')(Nightmare);

/*
'osltFpbuDo6sEMJB',
'RE0QRkb6hoEx87BB',
*/

queries = [
  'O81J2xbjrAIa6QkM',
  '20Kd65GlUC2CIkip',
  '8abzLhBpM1or48tl',
  'g2ULKrZQZ2yFxz93',
  'cLNo571Bs5IuP85B',
  'uWOtG9YSXJtPmIfa',
  'Ke6Piii6gplcn21b',
  'jDayjkMzzSeBQxjt',
  'DUrWkoKHmRHX1qJl',
  'rYBVFj6Zs1F2EuVA'
]

searchBuilds = []

queries.forEach((q)=>{
  searchBuilds.push(q+"&true");
  searchBuilds.push(q+"&false");
})


var nightmare = []
var j = 0

for(i=0;i<searchBuilds.length;i++){

  setTimeout(()=>{

      nightmare = new Nightmare({ show: false, height: 1080, width:1920, paths:{downloads: "/Users/patricklaflamme/Dropbox/AllyshipNetwork/network\ generator/Videos/"}, waitTimeout: 100000});

      nightmare
          .goto('http://localhost:8000/Simulation/?'+ searchBuilds[j])
          .viewport(1920,1080)
          .wait('a')
          .click("a")
          .download("continue")
          .click("input")
          .download("continue")
          .wait(1000)
          .end()
          .then(() => {
            console.log("Downloaded " + searchBuilds[j]);
            j++
          })
          .catch(e => console.log(e))
        }, i*60000);


}

/*waitForDownload(info){
  while(true){
    if(info.)
  }
}*/
