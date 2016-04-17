angular.module('borrow.signup', [])
.controller('signUpController', function($scope, filepickerService, $window, $location, Auth) {

    $scope.signUp = function() {

    var data = {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      userName: $scope.userName,
      password: $scope.password,
      picture: $scope.picture,
      created_At: Date()
    };

    Auth.createUser(data, function(token) {
        $window.localStorage.setItem('com.borrow', token);
        $location.path('/dashboard');
    });

  };
});

