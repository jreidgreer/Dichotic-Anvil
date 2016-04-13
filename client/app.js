angular.module('borrow', ['ngRoute',
  'borrow.userServices',
  'borrow.signup',
  'borrow.login',
  'borrow.dashboard'
])

.config(function($routeProvider) {
  $routeProvider

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
    controller: 'dashController'
  })
});