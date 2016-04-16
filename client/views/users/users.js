angular.module('borrow.users', [])
	.controller('userController', function($scope, $http) {
		$scope.users = '';
		$http.get('/api/users')
	  .success(function(data) {
	  	console.log(data);

	    $scope.users = data;

	  })
	  .error(function(data) {
	        console.log('Error: ' + data);
	  });

	$scope.addFriend = function (friend) {

		// when a user is clicked it will take the user id from the user's object and addFriend() that will
		// send a request to the databse to update our current user's friends list with the user's id

  return $http({
    method: 'POST',
    url: '/api/user/me/friends',
    data: {userName: friend}
    })
    .then(function (resp) {
      console.log(resp.data);
    });
  };

	});