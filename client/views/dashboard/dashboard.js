//Dashboard controller

angular.module('borrow.dashboard', [])
  .controller('dashController', function($scope, $http, Auth, filepickerService) {

  $scope.items = [];
  $scope.requestItems = [];
  $scope.requestMessages = [];

  // Get the user object to populate dashboard
  $http.get('/api/user/me')
    .success(function(data){
      // console.log(JSON.stringify(data));
      $scope.user = data;
      console.log($scope.user)

      $scope.numPersonalItems = $scope.user.inventory.length;
      // Iterate over inventory to populate user items
      for (var i = 0; i < $scope.user.inventory.length; i++) {
        $scope.items.push($scope.user.inventory[i].picture.url)
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

$scope.upload = function(){
        filepickerService.pick(
            {
                mimetype: 'image/*',
                language: 'en',
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob){
                console.log(JSON.stringify(Blob));
                $scope.user.picture = Blob;
                $scope.$apply();
            }
        );
    };
  $scope.signout = function() {
    Auth.signout();
  };

});
