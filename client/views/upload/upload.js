angular.module('borrow.upload', [])
.controller('uploadItemController', function($scope) {

  $scope.uploadItem = function() {
    
    var data = {
      itemName: $scope.itemName,
      itemImage: $scope.itemImage,
      itemDescription: $scope.itemDescription,
      created_At: Date()
    };

    
  };
});