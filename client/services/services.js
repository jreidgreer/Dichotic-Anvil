angular.module('borrow.userServices', [])
  .factory('User', function($http) {

    var createUser = function(user) {
      return $http.post('/api/users/', user)
        .then(function(resp){
          console.log('User Created!')
        })
        .catch(function(err) {
          console.log(err);
        });
    }

    // var getUser = function(userName) {
    //   return $http.get('/api/users/');
    // }

    return {
      createUser: createUser
    }
  });