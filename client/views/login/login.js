angular.module('borrow.login', [])
.controller('loginController', function($scope, $http) {

  $scope.postData = function() {
    
    var data = {
      userName: $scope.userName,
      password: $scope.password,
      created_At: Date()
    };

    $http.post('/api/users/', data)
      .then(function(resp) {
        console.log(resp.data)
      })
      .catch(function(err) {
        console.log('err: ', err);
      })
    }
});