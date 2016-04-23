angular.module('borrow.sendMessage', [])
.controller('sendMessageController', function($scope, $http, $routeParams, $location, Auth, Message){
    $scope.message = {};
    $scope.user_id = $routeParams.user_id;

    $http.get('/api/user/' + $scope.user_id)
    .then(function(resp){ 
      $scope.toUser = resp.data;
    })
    .catch(function(err) {
      console.log('Error Fetching User', err);
    })

    $scope.sendMessage = function(){
        console.log('Posting Message');
        $http.post('/api/messages', {
          title: $scope.message.title,
          message: $scope.message.message,
          ToUser: $scope.user_id
        })
        .success(function(data){
            $location.path('/profile/' + $scope.user_id);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
   $scope.signout = function() {
    Auth.signout();
  };
});
