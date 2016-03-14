angular.module('proyectotelematica.data', [])





.factory('PushData', function($http, $q,$rootScope) {
    var deferred = $q.defer();
    var promise = deferred.promise;
    var data = [];
    var service = {};


    service.actualizartokenservice=function(usuario){  
      var q = $q.defer(); 
      console.log($rootScope.baseURL+'61&usuario='+usuario+'&token='+localStorage.getItem("pushtoken")+'&uuid='+localStorage.getItem("uuid")+'&app='+'1');
      $http.get($rootScope.baseURL+'61&usuario='+usuario+'&token='+localStorage.getItem("pushtoken")+'&uuid='+localStorage.getItem("uuid")+'&app='+'1').success(function(data){
        q.resolve(data);
      });
      return q.promise;
    };
    service.actualizartoken = function(usuario){
      service.temporal = service.actualizartokenservice(usuario);
      service.temporal.then(function(val){
      });
    };
    service.actualizartoken2service=function(usuario){  
      var q = $q.defer(); 
            console.log($rootScope.baseURL+'59&usuario='+usuario+'&token='+localStorage.getItem("pushtoken")+'&uuid='+localStorage.getItem("uuid")+'&app='+'1');

      $http.get($rootScope.baseURL+'59&usuario='+usuario+'&token='+localStorage.getItem("pushtoken")+'&uuid='+localStorage.getItem("uuid")+'&app='+'1').success(function(data){
        q.resolve(data);
      });
      return q.promise;
    };
    service.actualizartoken2 = function(usuario){
      service.temporal = service.actualizartoken2service(usuario);
      service.temporal.then(function(val){
      });
    };
    service.insertartokenservice=function(usuario,token){  
      var q = $q.defer(); 
                  console.log($rootScope.baseURL+'57&usuario='+usuario+'&token='+token+'&platform='+localStorage.getItem("proyectotelematica_platform")+'&app='+'1'+'&uuid='+localStorage.getItem("uuid"));

      $http.get($rootScope.baseURL+'57&usuario='+usuario+'&token='+token+'&platform='+localStorage.getItem("proyectotelematica_platform")+'&app='+'1'+'&uuid='+localStorage.getItem("uuid")).success(function(data){
        q.resolve(data);
      }).
        error(function(data) {
            service.actualizartoken(-1);
            q.resolve(data);
        });
      return q.promise;
    };
    service.insertartoken = function(usuario,token){
      service.temporal = service.insertartokenservice(usuario,token);
      service.temporal.then(function(val){
        if(val=='ok'){
            //alert("popo");
        }else{
            service.actualizartoken2(usuario,token);
        }
      });
    };


    return service;
})





.factory('LoginData', function($http, $q,md5,$rootScope) {

   
    var service = {};


    service.async = function(correo,password) {

        var q = $q.defer();
        password = md5.createHash(password || '');
        $http.get($rootScope.serviceUrl+'tarea.php?op=35&correo='+correo+'&password='
        +password).success(function(data){
            q.resolve(data.listDep);
        });
        return q.promise;

    };
    
    

    return service;
})
.factory(("ionPlatform"), function( $q ){
    var ready = $q.defer();

    ionic.Platform.ready(function( device ){
        ready.resolve( device );
    });

    return {
        ready: ready.promise
    }
})