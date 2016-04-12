angular.module('borrow.signup', [])
.controller('signUpCtrl', function($scope, $http) {

  $scope.postData = function() {
    
    var data = {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      userName: $scope.userName,
      password: $scope.password,
      created_At: Date()
    };

    $http.post('/api/users/', data)
      .then(function(resp) {
        console.log(resp.data)
      })
      .catch(function(err) {
        console.log('this', err);
      })
    }
});