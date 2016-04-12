var borrowApp = angular.module('borrowApp', ['ngRoute']);

borrowApp.config(function($routeProvider) {
  $routeProvider

  .when('/login', {
    templateUrl : '/views/login.html',
    controller: 'loginController'
  })

  .when('/signup', {
    templateUrl : '/views/signup.html',
    controller: 'signUpCtrl'
  })

  .when('/user', {
    templateUrl : '/views/user.html',
    controller: 'userController'
  })
});

borrowApp.controller('loginController', function($scope) {

});

borrowApp.controller('signUpCtrl', function($scope) {
  $scope.firstName = '';
  $scope.lastName = '';
  $scope.userName = '';
  $scope.passWord = '';
});

borrowApp.controller('userController', function($scope) {
});
