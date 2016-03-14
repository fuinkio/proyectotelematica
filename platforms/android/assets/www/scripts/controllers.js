angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$rootScope,$q,$http,md5,$rootScope,$state,$cordovaPush,$ionicHistory,ionPlatform,PushData) {
  $rootScope.baseURL="http://10.131.137.200/proyecto1Controller/dataAccess.php?op=";
  // Form data for the login modal
   if(localStorage.getItem("id")){
    $scope.visible=false;
  }else{
    $scope.visible=true; 
  }
  $scope.loginData = {};





    $scope.notifications = [];

    // call to register automatically upon device ready
    ionPlatform.ready.then(function (device) {
       // alert(device.uuid);

        localStorage.setItem("uuid",window.device.uuid);
        if(localStorage.getItem("id")){//ITS MANDATORY TO HAVE A WAY  TO KNOW IF USER IS LOG OR NOT
            $scope.register();
            //$state.go('app.home');
        }
        else{
            $scope.register();
        }

    });


    // Register
    $scope.register = function () {
        var config = null;

        if (ionic.Platform.isAndroid()) {
            localStorage.setItem("proyectotelematica_platform","1");
            config = {
                "senderID": "747534169130" // REPLACE THIS WITH YOURS FROM GCM CONSOLE - also in the project URL like: https://console.developers.google.com/project/434205989073
            };
        }
        else if (ionic.Platform.isIOS()) {
            localStorage.setItem("proyectotelematica_platform","2");
            config = {
                "badge": "true",
                "sound": "true",
                "alert": "true"
            }
        }

        $cordovaPush.register(config).then(function (result) {
            console.log("Register success " + result);

            $scope.registerDisabled=true;
            // ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
            if (ionic.Platform.isIOS()) {
                $scope.regId = result;
                storeDeviceToken("ios");
            }
        }, function (err) {
            console.log("Register error " + err)
        });
    }

    // Notification Received
    $rootScope.$on('$cordovaPush:notificationReceived', function (event,notification) {
 //            alert(JSON.stringify([notification]));
 
        if (ionic.Platform.isAndroid()) {
            $rootScope.handleAndroid(notification);
        }
       
    });

    // Android Notification Received Handler
    $rootScope.handleAndroid = function (notification) {
    //function handleAndroid(notification) {
        // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
        //             via the console fields as shown.
        console.log("In foreground " + notification.foreground  + " Coldstart " + notification.coldstart);
        if (notification.event == "registered") {
            localStorage.setItem("pushtoken",notification.regid);
            PushData.insertartoken(-1,notification.regid);
           // alert(JSON.stringify(notification));
            //$scope.regId = notification.regid;
            //storeDeviceToken("android");
        }
        if (notification.event != "registered") {
      
          navigator.notification.beep(1);
          navigator.notification.vibrate(2000);
          if(notification.payload.payload.to=='viaje'){
            $cordovaDialogs.confirm('Deseas ir a solicitudes?', 'Tienes una nueva solicitud!', ['Si','No'])
              .then(function(buttonIndex) {
                if (buttonIndex==1) {
                  $state.go(notification.payload.payload.state);  
                }
              });
      
          }
        
        }
    }

  
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.logout = function() { 
     localStorage.removeItem("id");
     PushData.actualizartoken(-1);
     $scope.visible=true; 

     $ionicHistory.nextViewOptions({
        disableBack: true
     });
     $scope.loginData = {};
     $state.go('app.home'); 
  };

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $rootScope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
   $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $scope.resultado = $scope.loginService();
    $scope.resultado.then(function(val){

      if(val){        
        $scope.visible=false;   
        $scope.closeLogin();
        localStorage.setItem("id",val);
        PushData.actualizartoken(val);
        $state.go($rootScope.toState);
      }

    });
  };

$scope.loginService=function(){
      
    var q = $q.defer();
    $scope.loginData.password = md5.createHash($scope.loginData.password || '');
   console.log($rootScope.baseURL+"1&user="+$scope.loginData.correo+"&pass="+$scope.loginData.password);
    $http.get($rootScope.baseURL+"1&user="+$scope.loginData.correo+"&pass="+$scope.loginData.password).success(function(data){
      q.resolve(data);
    });
    return q.promise;
  };

})






.controller('registrarmeCtrl', function($scope,$q,$http,$state,$rootScope,md5,$ionicHistory) {
  
$scope.registrarme=function(){

    try {
      $correo=$scope.nuevousuario.correo;
      $pass=md5.createHash($scope.nuevousuario.pass || '');                 
      

if($pass!=""&&$correo!=""){
    

    var q = $q.defer();
    $http.get($rootScope.baseURL+"2&user="+$correo+"&pass="+$pass).success(function(data){
      q.resolve(data);
    });
    return q.promise;
  }else{
    alert("campos incompletos");
  }
 
}
catch(err) {
  alert("campos incompletos");
}

};
 
 $scope.llamarRegistrarme=function(){

$scope.act = $scope.registrarme();
    $scope.act.then(function(val){
      alert("registro exitoso"+" "+$correo);
      $scope.nuevousuario.correo="";
      $scope.nuevousuario.pass="";
      $pass="";
      $ionicHistory.nextViewOptions({
        disableBack: true
     });
      $state.go('app.home');
     });
 


 };





})



.controller('descubreCtrl', function($scope,$q,$http,$state,$rootScope,md5,$ionicHistory) {
$scope.canalesservice=function(){

    try {
      
   

    var q = $q.defer();
    $http.get($rootScope.baseURL+"6&userid="+localStorage.getItem("id")).success(function(data){
      q.resolve(data);
    });
    return q.promise;
 
 
}
catch(err) {
 // alert("ingrese nombre");
}

};
 
 $scope.canales=function(){

$scope.act = $scope.canalesservice();
    $scope.act.then(function(val){
      $scope.canales=val
     //alert(JSON.stringify(val));
      
     });
 


 };
$scope.canales();

 $scope.iracanal=function(id,nombre){

     localStorage.setItem("id_canal",id);
     localStorage.setItem("inscrito","no");
     localStorage.setItem("nombre_canal",nombre);
      $state.go('app.canal');
     
 


 };  


})




.controller('homeCtrl', function($scope,$q,$http,$state,$rootScope,md5,$cordovaPush) {
  

 

})

.controller('listacanalesCtrl', function($scope,$q,$http,$state,$rootScope,md5) {
$scope.canalesservice=function(){

    try {
      
   

    var q = $q.defer();
    $http.get($rootScope.baseURL+"5&userid="+localStorage.getItem("id")).success(function(data){
      q.resolve(data);
    });
    return q.promise;
 
 
}
catch(err) {
 // alert("ingrese nombre");
}

};
 
 $scope.canales=function(){

$scope.act = $scope.canalesservice();
    $scope.act.then(function(val){
      $scope.canales=val
    // alert(JSON.stringify(val));
      
     });
 


 };
$scope.canales();

 $scope.iracanal=function(id,nombre){

     localStorage.setItem("id_canal",id);
     localStorage.setItem("inscrito","si");
     localStorage.setItem("nombre_canal",nombre);
      $state.go('app.canal');
     
 


 };

})
.controller('canalCtrl', function($scope,$q,$http,$state,$rootScope,md5,$ionicHistory) {
  $scope.canal=localStorage.getItem("nombre_canal");
  if(localStorage.getItem("inscrito")=="si"){
    $scope.visi=true;
  }else{
    $scope.visi=false;
  }
  $scope.mensajesservice=function(){

    try {
      
   

    var q = $q.defer();
    $http.get($rootScope.baseURL+"7&channel="+localStorage.getItem("nombre_canal")).success(function(data){
      q.resolve(data);
    });
    return q.promise;
 
 
}
catch(err) {
 // alert("ingrese nombre");
}

};
 
 $scope.mensajes=function(){

$scope.act = $scope.mensajesservice();
    $scope.act.then(function(val){
      $scope.ms=val;
     });
 


 };



 $scope.inscribirservice=function(){

    try {
      
   

    var q = $q.defer();
    $http.get($rootScope.baseURL+"4&channel="+localStorage.getItem("nombre_canal")+"&userid="+localStorage.getItem("id")).success(function(data){
      q.resolve(data);
    });
    return q.promise;
 
 
}
catch(err) {
 // alert("ingrese nombre");
}

};
 
 $scope.inscribir=function(){

$scope.act = $scope.inscribirservice();
    $scope.act.then(function(val){
       $ionicHistory.nextViewOptions({
        disableBack: true
     });
      $state.go('app.listacanales');
     });
 


 };




 $scope.mensajes();

   $scope.nuevomensajeservice=function(message){

    try {
      $message=message;
      
if($message!=""){
    

    var q = $q.defer();
    $http.get($rootScope.baseURL+"8&userid="+localStorage.getItem("id")+"&message="+$message+"&channel="+localStorage.getItem("nombre_canal")).success(function(data){
      q.resolve(data);
    });
    return q.promise;
  }else{
    alert("ingrese mensaje");
  }
 
}
catch(err) {
  alert("ingrese mensaje");
}

};
 
 $scope.nuevomensaje=function(mensaje){

$scope.act = $scope.nuevomensajeservice(mensaje);
    $scope.act.then(function(val){
      $scope.mensajes();
      alert("mensaje enviado");
      
     });
 


 };




})
.controller('nuevocanalCtrl', function($scope,$q,$http,$state,$rootScope,md5,$ionicHistory) {
  $scope.nuevocanalservice=function(nombre){

    try {
      $nombre=nombre;
      

if($nombre!=""){
    

    var q = $q.defer();
    $http.get($rootScope.baseURL+"3&userid="+localStorage.getItem("id")+"&name="+$nombre).success(function(data){
      q.resolve(data);
    });
    return q.promise;
  }else{
    alert("ingrese nombre");
  }
 
}
catch(err) {
  alert("ingrese nombre");
}

};
 
 $scope.nuevocanal=function(nombre){

$scope.act = $scope.nuevocanalservice(nombre);
    $scope.act.then(function(val){
      alert(val);
      //alert("registro exitoso"+" "+nombre);
      $ionicHistory.nextViewOptions({
        disableBack: true
     });
      $state.go('app.home');
     });
 


 };



})

;


















