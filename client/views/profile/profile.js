//Dashboard controller

angular.module('borrow.profile', [])
  .controller('profileController', function($routeParams, $scope, $http, Auth) {

  $scope.items = [];
  $scope.myFriend = '';

  var user_id = $routeParams.user_id;
  // Get the user object to populate dashboard
  $http.get('/api/user/' + user_id)
    .success(function(data){
      // console.log(JSON.stringify(data));
      $scope.user = data;
      console.log($scope.user)

      $scope.numPersonalItems = $scope.user.inventory.length;
      // Iterate over inventory to populate user items
      for (var i = 0; i < $scope.user.inventory.length; i++) {
        $scope.items.push($scope.user.inventory[i])
       }
      // Iterate over inventory to populate items that have requests
      for (var i = 0; i < $scope.user.inventory.length; i++) {
        if($scope.user.inventory[i].requested) {
          $scope.requestItems.push($scope.user.inventory[i]);
        }
      }
      // Push strings to requestMessages array
      for(var i = 0; i < $scope.requestItems.length; i++) {
        $scope.requestMessages.push($scope.requestItems[i].whoWantsIt + ' would like to borrow your ' + $scope.requestItems[i].itemName)
      }
    })
    .error(function(data) {
      console.log('Error: ' + data);
  });  

  $scope.borrow = function(item){
    $http({
      method: 'POST',
      url: '/api/items/'+ item._id + '/borrow',
      data: {duration: 5, message: 'Test'}
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
