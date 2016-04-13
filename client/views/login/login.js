angular.module('borrow.login', [])
.controller('loginController', function($scope, $http, $location, User) {

  $scope.login = function() {
    
    var data = {
      userName: $scope.userName,
      password: $scope.password
    };

   User.login(data, function(resp) {
    if (!resp.error) {
      $location.path('/dashboard');
    } else {
      $scope.error = 'Incorrect username or password!!!!!';
    }
   });
  
  };
});