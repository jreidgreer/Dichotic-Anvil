//gallery controller

angular.module('borrow.gallery', [])
  .controller('galleryController', function($scope, Auth, $http) {
  $scope.items = [];
    //Retrieve all the items to show the gallery
  $http.get('/api/items')
  .success(function(data){
    console.log(JSON.stringify(data));
     $scope.items = data;
  })
  .error(function(data) {
        console.log('Error: ' + data);
  });
 $scope.orderProp="name";

  $scope.borrow = function(item){
    $http({
      method: 'POST',
      url: '/api/items/'+ item._id + '/borrow',
      data: {duration: 5, message: 'Can I borrow this?'}
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
