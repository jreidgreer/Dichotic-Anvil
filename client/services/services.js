angular.module('borrow.userServices', [])

  .factory('Auth', function ($http, $location, $window) {
  var login = function (user, callback) {
    return $http({
      method: 'POST',
      url: '/api/users/login',
      data: user
    })
    .then(function (resp) {
      callback(resp.data.token, resp.data.user);
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

 var updateUser = function (user, callback) {
    return $http({
      method: 'PUT',
      url: '/api/users/:user_id',
      data: user
    })
    .then(function (resp) {
      callback(resp.data.user);
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.borrow');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.borrow');
    $location.path('/');
  };


  return {
    login: login,
    createUser: createUser,
    updateUser: updateUser,
    isAuth: isAuth,
    signout: signout
  };
});
