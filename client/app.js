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

.config(function($routeProvider, filepickerProvider, $httpProvider) {
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
})
.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
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
.run(function ($rootScope, $location, Auth) {
    window.fbAsyncInit = function() {
    FB.init({
      appId      : '267351013600997',
      cookie     : true,  // enable cookies to allow the server to access 
                          // the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.5' // use graph api version 2.5
    });
  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "http://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/login');
    }
  });
});



