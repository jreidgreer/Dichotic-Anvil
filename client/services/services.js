angular.module('borrow.userServices', [])
  .factory('User', function($http, $location) {

    var createUser = function(user) {
      return $http.post('/api/users/', user)
        .then(function(resp){
          console.log('User Created!')
        })
        .catch(function(err) {
          console.log(err);
        });
    }

    var login = function(user, callback) {
      return $http.post('/api/users/login', user)
        .then(function(resp) {
          callback(resp.data)
          console.log('User logged in')
        })
        .catch(function(err) {
          console.log(err);
        });
    }

    return {
      createUser: createUser,
      login: login
    }
  });