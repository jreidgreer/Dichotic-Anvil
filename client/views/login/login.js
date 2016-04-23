angular.module('borrow.login', [])
.controller('loginController', function($scope, $window, $location, Auth) {

  $scope.login = function() {

    var data = {
      userName: $scope.userName,
      password: $scope.password
    };

    Auth.login(data, function(token, data) {
        $window.localStorage.setItem('com.borrow', token);
        $window.localStorage.setItem('userName', data);
        $location.path('/dashboard');
    });
  };

  $scope.FBlogin = function() {
    FB.login(function(response) {
        if (response.authResponse) {
         console.log('Welcome!  Fetching your information.... ');
         FB.api('/auth/facebook', function(response) {
           console.log('Good to see you, ' + response.name + '.');
         });
        } else {
         console.log('User cancelled login or did not fully authorize.');
        }
    }, {scope: 'email,user_likes'});
  };
});
