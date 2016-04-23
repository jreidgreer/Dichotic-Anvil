//Dashboard controller

angular.module('borrow.dashboard', [])
  .controller('dashController', function($rootScope, $scope, $http, $location, Auth, Item, filepickerService) {

  $scope.items = [];
  $scope.requests = {
    items: [],
    requesters: []
  };
  $scope.requestItems = [];
  $scope.requestMessages = [];
  $scope.numMessages = 0;
  $scope.myFriend = '';
  $scope.borrowing = [];
  $scope.numBorrowing = $scope.borrowing.length;

  // Get the user object to populate dashboard
  Auth.getMe(function(data) {
    console.log('Received User Data: ', data);

    var users;
    var items;

    Auth.getUsers(function(data) {
      console.log("borrower info====", data);
      users = data;
      Item.getAll(function(data) {
        console.log("ITEMS info====", data);
        items = data;
        getUserInfo();
      });
    });


    $scope.user = data;
    $scope.numPersonalItems = $scope.user.inventory.length;
    $scope.numFriends = $scope.user.friends.length;

    // User Items
    // for (var i = 0; i < $scope.user.inventory.length; i++) {
    //     $scope.items.push($scope.user.inventory[i].picture)
    // }

    // Iterate over inventory to populate items that have requests
    var getUserInfo = function() {
    for (var i = 0; i < $scope.user.inventory.length; i++) {
      if (!$scope.user.inventory[i].borrowed){
        if ($scope.user.inventory[i].requests) {
          for (var j = 0; j < $scope.user.inventory[i].requests.length; j++) {
            console.log("requests======", $scope.user.inventory[i].requests[j]);
            $scope.requestItems.push($scope.user.inventory[i].requests[j]);
            $scope.numMessages++; 
            var requesterid = $scope.user.inventory[i].requests[j].BorrowId;
            var itemid = $scope.user.inventory[i].requests[j].Item;
            for(var k = 0; k < users.length; k++){
              if (requesterid === users[k].id) {
                $scope.requests.requesters.push(users[k].firstName);
              }
            }
            for(var l = 0; l < items.length; l++){
              if (itemid === items[l].id) {
                $scope.requests.items.push(items[l].itemName);
              }
            }
            console.log("REQUESTS collection");
            console.log($scope.requests);
          }
        }
      }
    }
  };

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
