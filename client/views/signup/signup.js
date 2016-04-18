angular.module('borrow.signup', [])
.controller('signUpController', function($scope, filepickerService, $window, $location, Auth) {



    $scope.upload = function(){

        filepickerService.pick(
            {
                mimetype: 'image/*',
                language: 'en',
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob){
                $scope.picture = Blob;
                $scope.$apply();
            }
        );
    };
$scope.signUp = function() {


      // check to see if user has uploaded an image yet




      var data = {
        firstName: $scope.firstName,
        lastName: $scope.lastName,
        userName: $scope.userName,
        password: $scope.password,
        picture: $scope.picture,
        created_At: Date()
      };


      Auth.createUser(data, function(token) {
          $window.localStorage.setItem('com.borrow', token);
          $location.path('/dashboard');
      });

    };
});

