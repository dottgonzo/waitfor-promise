var q=require('q'),
Promise=require('promise'),
merge=require('json-add'),
verb=require('verbo');

var options={
  time:5000,
  timeout:120000,
  verbose:true
}



module.exports = {
  pre:function(fun,conf){
    if(conf){
      merge(options,conf)
    }
    var timeout=new Date().getTime()+options.timeout;
    var prom=q;
    var deferred = prom.defer();

    function retry(f,time,timeout){
      setTimeout(function(){
        f().then(function(data){
          deferred.resolve(data)
        }).catch(function(err){
          if(new Date().getTime()<timeout){
            if(options.verbose){
              verb(err,'warn','waitfor-promise retryng')
            }

            retry(f,time,timeout)
          } else{
            if(options.verbose){
              verb(err,'warn','waitfor-promise timeout')
            }

            deferred.reject('timeout')
          }
        })
      },time)
    }

    fun().then(function(data){
      deferred.resolve(data)
    }).catch(function(err){
      if(options.verbose){
        verb(err,'warn','waitfor-promise retryng')
      }

      retry(fun,options.time,timeout)
    })

    return deferred.promise;
  },
  post:function(fun,conf){
    if(conf){
      merge(options,conf)
    }
    var timeout=new Date().getTime()+options.timeout;
    var prom=q;
    var deferred = prom.defer();

    function retry(f,time,timeout){
      setTimeout(function(){
        f().then(function(data){
          deferred.resolve(data)
        }).catch(function(err){
          if(new Date().getTime()<timeout){
            if(options.verbose){
              verb(err,'warn','waitfor-promise retryng')
            }
            retry(f,time,timeout)
          } else{

            if(options.verbose){
              verb(err,'warn','waitfor-promise timeout')
            }


            deferred.reject('timeout')
          }
        })
      },time)
    }

    retry(fun,options.time,timeout)
    return deferred.promise;
  }
}
