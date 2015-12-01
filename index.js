var q=require('q'),
Promise=require('promise'),
merge=require('json-add'),
verb=require('verbo');

var options={
  time:5000,
  timeout:120000
}



module.exports = {
  pre:function(fun,conf){
    if(conf){
      merge(options,conf)
    }
    var timeout=new Date().getTime()+options.timeout;
    var deferred = q.defer();

    function retry(f,time,timeout){
      setTimeout(function(){
        f().then(function(data){
          deferred.resolve(data)
        }).catch(function(err){
          if(new Date().getTime()<timeout){
            verb(err,'warn','waitfor-promise is retryng')
            retry(f,time,timeout)
          } else{
            verb(err,'warn','waitfor-promise timeout')
            deferred.reject(data)
          }
        })
      },time)
    }

    fun().then(function(data){
      deferred.resolve(data)
    }).catch(function(err){
      verb(err,'warn','waitfor-promise is retryng')
      retry(fun,options.time,timeout)
    })

    return deferred.promise;
  },
  post:function(fun,conf){
    if(conf){
      merge(options,conf)
    }
    var timeout=new Date().getTime()+options.timeout;
    var deferred = q.defer();

    function retry(f,time,timeout){
      setTimeout(function(){
        f().then(function(data){
          deferred.resolve(data)
        }).catch(function(err){
          if(new Date().getTime()<timeout){
            verb(err,'warn','waitfor-promise is retryng')
            retry(f,time,timeout)
          } else{
            verb(err,'warn','waitfor-promise timeout')
            deferred.reject(data)
          }
        })
      },time)
    }

    retry(fun,options.time,timeout)
    return deferred.promise;
  }
}
