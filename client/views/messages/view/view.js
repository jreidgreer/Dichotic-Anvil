angular.module('borrow.viewMessages', [])
  .controller('viewMessagesController', function($scope, $http, Message, Auth) {
    $http.get('/api/messages/')
    .then(function(resp) {
      console.log(resp.data);
      $scope.messages = resp.data;
    })
    .catch(function(data) {
          console.log('Error: ' + data);
    });

$scope.signout = function() {
    Auth.signout();
  };
});
