//Dashboard controller

angular.module('borrow.dashboard', [])
  .controller('dashController', function($scope, Auth) {

  $scope.signout = function() {
  Auth.signout();
  };
});
