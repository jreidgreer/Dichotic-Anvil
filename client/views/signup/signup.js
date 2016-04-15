angular.module('borrow.signup', [])
.controller('signUpController', function($scope, filepickerService, $window, $location, Auth) {

    $scope.signUp = function() {
    // $scope.upload = function(){
    //   filepickerService.pick(
    //   {
    //   mimetype: 'image/*',
    //   language: 'en',
    //   services: ['COMPUTER', 'FACEBOOK', 'INSTAGRAM'],
    //   openTo: 'COMPUTER'
    //   },

    //   function(Blob){
    //   console.log(JSON.stringify(Blob));
    //   $scope.picture = Blob;
    //   $scope.$apply();
    //   }
    //  );
    // };
    var data = {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      userName: $scope.userName,
      password: $scope.password,
      // picture: $scope.picture,
      created_At: Date()
    };

    Auth.createUser(data, function(token) {
        $window.localStorage.setItem('com.borrow', token);
        $location.path('/dashboard');
    });

  };
});
