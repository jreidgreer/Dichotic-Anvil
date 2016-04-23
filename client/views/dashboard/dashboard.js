//Dashboard controller

angular.module('borrow.dashboard', ['borrow.gallery'])
  .controller('dashController', function($rootScope, $scope, $http, $location, Auth, filepickerService) {

  $scope.items = [];
  $scope.requestItems = [];
  $scope.requestMessages = [];
  $scope.numMessages = 0;
  $scope.myFriend = '';
  $scope.borrowing = [];
  $scope.numBorrowing = $scope.borrowing.length;

  // Get the user object to populate dashboard
  Auth.getMe(function(data) {
    console.log('Received User Data: ', data);
    $scope.user = data;
    $scope.numPersonalItems = $scope.user.inventory.length;
    $scope.numFriends = $scope.user.friends.length;

    // User Items
    for (var i = 0; i < $scope.user.inventory.length; i++) {
        $scope.items.push($scope.user.inventory[i].picture)
      }

    // Iterate over inventory to populate items that have requests
    for (var i = 0; i < $scope.user.inventory.length; i++) {
      if (!$scope.user.inventory[i].borrowed){
        if ($scope.user.inventory[i].requests) {
          // console.log($scope.user.inventory[i].requests);
          for (var j = 0; j < $scope.user.inventory[i].requests.length; j++) {
            console.log("requests======", $scope.user.inventory[i].requests[j]);
            $scope.requestItems.push($scope.user.inventory[i].requests[j]);
            $scope.numMessages++; 
          }
        }
      }
    }

    // Items Currently Borrowing
    for (var i = 0; i < $scope.user.borrowing.length; i++) {
        $scope.borrowing.push($scope.user.borrowing[i].item.itemName);
      }
    });
    // .error(function(data) {
    //   console.log(JSON.stringify(data));
  // });

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
      });
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
      });
    };

  $scope.signout = function() {
    Auth.signout();
  };

});
