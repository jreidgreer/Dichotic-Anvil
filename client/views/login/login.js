angular.module('borrow.login', [])
.controller('loginController', function($scope, $window, $location, Auth) {
    
    // $scope.fbAsyncInit = function() {
    //   FB.init({
    //     appId      : '267351013600997',
    //     cookie     : true, 
    //     xfbml      : true,
    //     version    : 'v2.6'
    //   });
    // };

    // (function(d, s, id){
    //    var js, fjs = d.getElementsByTagName(s)[0];
    //    if (d.getElementById(id)) {return;}
    //    js = d.createElement(s); js.id = id;
    //    js.src = "//connect.facebook.net/en_US/sdk.js";
    //    fjs.parentNode.insertBefore(js, fjs);
    //  }(document, 'script', 'facebook-jssdk'));

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

  // $scope.FBlogin = function() {
  //   FB.login(function(err, resp) {
  //     if (err) {
  //       console.log(err);
  //     } else {

  //     }
  //   });
  // };
});
