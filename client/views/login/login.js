angular.module('borrow.login', [])
.controller('loginController', function($scope, $window, $location, Auth) {

  $scope.login = function() {
    
    var data = {
      userName: $scope.userName,
      password: $scope.password
    };

    Auth.login(data, function(token) {
        $window.localStorage.setItem('com.borrow', token);
        $location.path('/dashboard');
    });
  };
});