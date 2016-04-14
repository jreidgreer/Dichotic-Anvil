//gallery controller

angular.module('borrow.gallery', [])
  .controller('galleryController', function($scope, Auth, $http) {
  $scope.items = [];
    //Retrieve all the superheroes to show the gallery
  $http.get('/api/items')
  .success(function(data){
    console.log(JSON.stringify(data));
     $scope.items = data;
  })
  .error(function(data) {
        console.log('Error: ' + data);
  });
 $scope.orderProp="name";

  $scope.signout = function() {
  Auth.signout();
  };
});
