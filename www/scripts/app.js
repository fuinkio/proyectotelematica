// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','angular-md5','ionic-datepicker','ionic-timepicker','proyectotelematica.data','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
//http interceptors for show loading
.config(function($httpProvider) {
  $httpProvider.interceptors.push(function($rootScope) {
    return {
      request: function(config) {
        $rootScope.$broadcast('loading:show')
        return config
      },
      response: function(response) {
        $rootScope.$broadcast('loading:hide')
        return response
      }
    }
  })
})

.run(function($rootScope, $ionicLoading) {
  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({template: 'Loading...'})
  })

  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide()
  })
})

//end of http interceptors for show loading

.run(function ($rootScope) {

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;
          if (requireLogin &&  !localStorage.getItem("id") )  { 
      event.preventDefault();
      $rootScope.toState = toState;
     $rootScope.login();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })
 .state('app.home', {
  cache: false,
    url: "/home",
    data: {
        requireLogin: false
      },
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'homeCtrl'
      }
    }
  })




.state('app.registrarme', {
      url: "/registrarme",
      data: {
        requireLogin: false
      },
      views: {
        'menuContent': {
          templateUrl: "templates/registrarme.html",
          controller: 'registrarmeCtrl'
        }
      }
    })


.state('app.listacanales', {
  cache: false,
      url: "/listacanales",
      data: {
        requireLogin: true
      },
      views: {
        'menuContent': {
          templateUrl: "templates/listacanales.html",
          controller: 'listacanalesCtrl'
        }
      }
    })

.state('app.descubre', {
  cache: false,
      url: "/descubre",
      data: {
        requireLogin: true
      },
      views: {
        'menuContent': {
          templateUrl: "templates/descubre.html",
          controller: 'descubreCtrl'
        }
      }
    })


.state('app.canal', {
  cache: false,
      url: "/canal",
      data: {
        requireLogin: false
      },
      views: {
        'menuContent': {
          templateUrl: "templates/canal.html",
          controller: 'canalCtrl'
        }
      }
    })

.state('app.nuevocanal', {
  cache: false,
      url: "/nuevocanal",
      data: {
        requireLogin: true
      },
      views: {
        'menuContent': {
          templateUrl: "templates/nuevocanal.html",
          controller: 'nuevocanalCtrl'
        }
      }
    })
;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
