import * as q from "q";
import * as Promise from "bluebird";
import merge = require("json-add");
let verb=require('verbo');

interface Iopt {
    time:number;
    timeout:number;
    verbose:boolean;
};

let options:Iopt={
  time:5000,
  timeout:120000,
  verbose:true
}



export = {
  pre:function(fun:Function,conf:Iopt){
    if(conf){
      merge(options,conf)
    }
    let timeout=new Date().getTime()+options.timeout;
    let prom=q;
    let deferred = prom.defer();

    function retry(f:Function,time:number,timeout:number){
      setTimeout(function(){
        f().then(function(data){
          deferred.resolve(data)
        }).catch(function(err){
          if(new Date().getTime()<timeout){
            if(options.verbose){
              verb(err,'warn','waitfor-promise retryng')
            };
            retry(f,time,timeout);
          } else{
            if(options.verbose){
              verb(err,'warn','waitfor-promise timeout');
            };
            deferred.reject('timeout');
          };
        });
      },time);
    };

    fun().then(function(data){
      deferred.resolve(data)
    }).catch(function(err){
      if(options.verbose){
        verb(err,'warn','waitfor-promise retryng')
      }
      retry(fun,options.time,timeout)
    });
    return deferred.promise;
  },
  post:function(fun:Function,conf:Iopt){
    if(conf){
      merge(options,conf)
    }
    let timeout=new Date().getTime()+options.timeout;
    let prom=q;
    let deferred = prom.defer();

    function retry(f:Function,time:number,timeout:number){
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

    retry(fun,options.time,timeout);
    return deferred.promise;
  }
}
