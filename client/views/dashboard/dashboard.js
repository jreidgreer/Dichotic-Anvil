//Dashboard controller

angular.module('borrow.dashboard', [])
  .controller('dashController', function($rootScope, $scope, $http, $location, Auth, filepickerService) {

  $scope.items = [];
  $scope.requestItems = [];
  $scope.requestMessages = [];
  $scope.myFriend = '';
  $scope.borrowing = [];

  // Get the user object to populate dashboard
  $http.get('/api/user/me')
    .success(function(data){
      // console.log(JSON.stringify(data));
      $scope.user = data;
      console.log('USER!!!!!!!!!!!!!!!',$scope.user)

      $scope.numPersonalItems = $scope.user.inventory.length;
      // Iterate over inventory to populate user items
      for (var i = 0; i < $scope.user.inventory.length; i++) {
        $scope.items.push($scope.user.inventory[i].picture.url)
       }
      // Iterate over inventory to populate items that have requests
      for (var i = 0; i < $scope.user.inventory.length; i++) {
        if (!$scope.user.inventory[i].borrowed){
          if ($scope.user.inventory[i].requests) {
            // console.log($scope.user.inventory[i].requests);
            for (var j = 0; j < $scope.user.inventory[i].requests.length; j++) {

              console.log($scope.user.inventory[i].requests[j]);
              $scope.requestItems.push($scope.user.inventory[i].requests[j]);
            }
          }
        }
      }

      for (var i = 0; i < $scope.user.borrowing.length; i++) {
        $scope.borrowing.push($scope.user.borrowing[i].item.itemName)
      }
    })
    .error(function(data) {
      console.log('Error: ' + data);
  });

    $scope.viewProfile = function (friendId) {
      $location.path('/profile/'+ friendId);
    };

    $scope.approve = function(id) {
      $http({
        method: 'PUT',
        url: '/api/requests/' + id,
        data: {action: 'approve'}
      })
      .then(function (resp) {
        console.log(resp);
      })
      .catch(function(err) {
        console.log(err);
      })
    };

    $scope.deny = function(id) {
      $http({
        method: 'PUT',
        url: '/api/requests/' + id,
        data: {action: 'deny'}
      })
      .then(function (resp) {
        console.log(resp);
      })
      .catch(function(err) {
        console.log(err);
      })
    };

  $scope.signout = function() {
    Auth.signout();
  };

});
