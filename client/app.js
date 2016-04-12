var borrowApp = angular.module('borrowApp', ['ngRoute']);

borrowApp.config(function($routeProvider) {
  $routeProvider

  .when('/login', {
    templateUrl : '/views/login.html',
    controller: 'loginController'
  })

  .when('/signup', {
    templateUrl : '/views/signup.html',
    controller: 'signUpCtrl'
  })

  .when('/user', {
    templateUrl : '/views/user.html',
    controller: 'userController'
  })
});

borrowApp.controller('loginController', function($scope) {

});

borrowApp.controller('signUpCtrl', function($scope, $http) {

  $scope.postData = function() {
    
    var data = {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      userName: $scope.userName,
      password: $scope.password,
      created_At: Date()
    };

    $http.post('/api/users/', data)
      .then(function(resp) {
        console.log(resp.data)
      })
      .catch(function(err) {
        console.log('this', err);
      })
    }
});

borrowApp.controller('userController', function($scope) {
});


 // $scope.postData = function() {
   
    
 //  $http.post('/api/users', data)
 //    .success(function(data, status, headers, config) {
 //      $scope.response = data;
 //    })
 //    .error(function(data, status, headers, config) {
 //      $scope.responseDetails = 'Data ' + data
 //    });
 //    $scope.signUpForm.$setPristine();
 //  }
