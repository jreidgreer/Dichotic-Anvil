//Dashboard controller

angular.module('borrow.dashboard', [])
  .controller('dashController', function($scope, $http, Auth) {

  $scope.items = [];

  $http.get('/api/user/me')
  .success(function(data){
    console.log(JSON.stringify(data));
     $scope.items = data;
  })
  .error(function(data) {
        console.log('Error: ' + data);
  });

  $scope.signout = function() {
  Auth.signout();
  };
});
