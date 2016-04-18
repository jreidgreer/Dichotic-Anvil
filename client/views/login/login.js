angular.module('borrow.login', [])
.controller('loginController', function($scope, $window, $location, Auth) {

  $scope.login = function() {

    var data = {
      userName: $scope.userName,
      password: $scope.password
    };

    Auth.login(data, function(token, data) {
        $window.localStorage.setItem('com.borrow', token);
        $window.localStorage.setItem('userName', data);
        $location.path('/dashboard');
    });
  };
});
