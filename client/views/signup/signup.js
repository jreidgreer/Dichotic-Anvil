angular.module('borrow.signup', [])
.controller('signUpCtrl', function($scope, $http, User) {

  $scope.signUp = function() {
    
    var data = {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      userName: $scope.userName,
      password: $scope.password,
      created_At: Date()
    };

    User.createUser(data);
  };
});