//Dashboard controller

angular.module('borrow.dashboard', [])
  .controller('dashController', function($scope, $http, Auth) {

  $scope.items = [];

  $http.get('/api/user/me')
  .success(function(data){
    console.log(JSON.stringify(data));
     $scope.user = data;
     console.log($scope.user)

     for (var i = 0; i < $scope.user.inventory.length; i++) {
      $scope.items.push($scope.user.inventory[i].picture.url)
     }
  })
  .error(function(data) {
        console.log('Error: ' + data);
  });

  $scope.signout = function() {
  Auth.signout();
  };
});
