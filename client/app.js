angular.module('borrow', ['ngRoute',
  'angular-filepicker',
  'borrow.userServices',
  'borrow.signup',
  'borrow.login',
  'borrow.upload',
  'borrow.gallery',
  'borrow.landing',
  'borrow.dashboard',
  'borrow.users',
  'borrow.profile'
])

.config(function($routeProvider, filepickerProvider, $provide, $httpProvider) {
  $routeProvider

  .when('/', {
      templateUrl: './views/landing/landing.html',
      controller: 'landingController'
    })

  .when('/login', {
    templateUrl : './views/login/login.html',
    controller: 'loginController'
  })

  .when('/signup', {
    templateUrl : './views/signup/signup.html',
    controller: 'signUpController'
  })

  .when('/dashboard', {
    templateUrl : './views/dashboard/dashboard.html',
    controller: 'dashController',
    authenticate: true
  })

  .when('/upload', {
    templateUrl : './views/upload/upload.html',
    controller: 'addItemController',
    authenticate: true
  })

  .when('/gallery', {
    templateUrl : './views/gallery/gallery.html',
    controller: 'galleryController',
    authenticate: true
  })
  .when('/users', {
    templateUrl : './views/users/users.html',
    controller: 'userController',
    authenticate: true
  })
  .when('/profile/:user_id', {
    templateUrl : './views/profile/profile.html',
    controller: 'profileController',
    authenticate: true
  })
  .otherwise('/');

  filepickerProvider.setKey('A1IrC7fsKQuqV78eZa0euz');
  $httpProvider.interceptors.push('AttachTokens');
  $httpProvider.interceptors.push('myHttpInterceptor');
})
.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      // console.log(object); //check contents of object
      var jwt = $window.localStorage.getItem('com.borrow');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})

.factory('myHttpInterceptor', function($q) {
  return {
    request: function(config) {
      // console.log(config);
      return config || $q.when(config);
    },
    requestError: function(rejection) {
      // console.log(rejection);
      return $q.reject(rejection);
    },
    response: function(resp) {
      // console.log(resp);
      return resp || $q.when(resp);
    },
    responseError: function(rejection) {
      // console.log(rejection);
      return $q.reject(rejection);
    }
  };
})

.run(function ($rootScope, $location, Auth, $http) {
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate) {
      if (Auth.isAuth()) {
        $http.get('/api/users/signedin').then(function(user){
          if (!user) {
            $location.path('/login');
          }
        });
      }
    }
  });
});



