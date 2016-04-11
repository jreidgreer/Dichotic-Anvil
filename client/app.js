var borrowApp = angular.module('borrowApp', ['ngRoute']);

borrowApp.config(function($routeProvider) {
  $routeProvider

  .when('/login', {
    templateUrl : '/views/login.html',
    controller: 'loginController'
  })

  .when('/signup', {
    templateUrl : '/views/signup.html',
    controller: 'signupController'
  })

  .when('/user', {
    templateUrl : '/views/user.html',
    controller: 'userController'
  })
});

borrowApp.controller('loginController', function($scope){
  $scope.message = 'YO YO YO YO'
});

borrowApp.controller('signupController', function($scope){
});

borrowApp.controller('userController', function($scope){
});
