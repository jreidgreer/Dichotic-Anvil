angular.module('borrow.users', [])
	.controller('userController', function($scope, $http, Auth) {
		$scope.users = '';
		$http.get('/api/users')
	  .success(function(data) {
	  	console.log(data);

	  	return;

	    $scope.users = data;
			for (var i = 0; i < $scope.user.inventory.length; i++) {
	      $scope.items.push($scope.user.inventory[i].picture.url)
	     }
	  })
	  .error(function(data) {
	        console.log('Error: ' + data);
	  });

	})