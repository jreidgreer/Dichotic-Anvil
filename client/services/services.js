angular.module('borrow.userServices', [])

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
      url: '/api/users/signup',
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
