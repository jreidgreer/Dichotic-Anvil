angular.module('borrow.userServices', [])
  // .factory('User', function($http, $location) {

  //   var createUser = function(user) {
  //     return $http.post('/api/users/', user)
  //       .then(function(resp){
  //         console.log('User Created!')
  //       })
  //       .catch(function(err) {
  //         console.log(err);
  //       });
  //   }

  //   var login = function(user, callback) {
  //     return $http.post('/api/users/login', user)
  //       .then(function(resp) {
  //         callback(resp.data)
  //         console.log('User logged in')
  //       })
  //       .catch(function(err) {
  //         console.log(err);
  //       });
  //   }

  //   return {
  //     createUser: createUser,
  //     login: login
  //   }
  // })

  .factory('Auth', function ($http, $location, $window) {
  var login = function (user, callback) {
    return $http({
      method: 'POST',
      url: '/api/users/login',
      data: user
    })
    .then(function (resp) {
      callback(resp.data.token);
    });
  };

  var createUser = function (user, callback) {
    return $http({
      method: 'POST',
      url: '/api/users/',
      data: user
    })
    .then(function (resp) {
      callback(resp.data.token);
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.borrow');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.borrow');
    $location.path('/login');
  };


  return {
    login: login,
    createUser: createUser,
    isAuth: isAuth,
    signout: signout
  };
});
