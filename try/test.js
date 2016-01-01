var waitfor=require('../index'),
Promise=require('bluebird');


var f=function(){
  var datestart=10;
  var date=new Date().getSeconds()-30

  return new Promise(function(resolve,reject){
    if(date>datestart){
      resolve(date)
    } else{
      console.log(date,datestart)
      reject(date)
    }
  })
}

waitfor.pre(f,{
  time:1000,
  timeout:3000,
  verbose:false
}).then(function(answer){
  console.log(answer)
}).catch(function(err){
  console.log('timeout? '+err)
})
