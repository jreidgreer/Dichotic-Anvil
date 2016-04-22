angular.module('borrow.upload', [])
.controller('addItemController', function($scope, $http, filepickerService, Auth){
    $scope.item = {};
    //Send the newly created superhero to the server to store in the db
    $scope.createItem = function(){
        console.log('Posting Item');
        $http.post('/api/items', $scope.item)
            .success(function(data){
                console.log(JSON.stringify(data));
                //Clean the form to allow the user to create new superheroes
                $scope.item = {};
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    //Single file upload, you can take a look at the options
    $scope.upload = function(){
        filepickerService.pick(
            {
                mimetype: 'image/*',
                language: 'en',
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob){
                console.log(JSON.stringify(Blob.url));
                $scope.item.picture = Blob.url;
                $scope.$apply();
            }
        );
    };
   $scope.signout = function() {
    Auth.signout();
  };
});
