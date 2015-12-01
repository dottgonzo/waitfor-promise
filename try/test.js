var waitfor=require('../index'),
Promise=require('promise');


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
  time:2000,
  timeout:10000
}).then(function(answer){
  console.log(answer)
}).catch(function(err){
  console.log(err)

})
