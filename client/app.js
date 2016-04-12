angular.module('borrow', ['ngRoute',
  'borrow.signup'
])

.config(function($routeProvider) {
  $routeProvider

  .when('/login', {
    templateUrl : '/views/login.html',
    controller: 'loginController'
  })

  .when('/signup', {
    templateUrl : '/views/signup/signup.html',
    controller: 'signUpCtrl'
  })

  .when('/dashboard', {
    templateUrl : '/views/dashboard.html',
    controller: 'dashController'
  })
});