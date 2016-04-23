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

  var getMe = function (callback) {
    return $http({
      method: 'GET',
      url: '/api/user/me'
    })
    .then(function (resp) {
      callback(resp.data);
    });
  };

  var getUsers = function(callback) {
    return $http({
      method: 'GET',
      url: '/api/users/'
    })
    .then(function(resp) {
      callback(resp.data);
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
    // return true;
    return !!$window.localStorage.getItem('com.borrow');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.borrow');
    var landingUrl = "http://" + $window.location.host + '/logout';
    $window.location.href = landingUrl;
  };

  return {
    login: login,
    createUser: createUser,
    updateUser: updateUser,
    getUsers: getUsers,
    isAuth: isAuth,
    signout: signout,
    getMe: getMe
  };
})
.factory('Item', function($http) {
  var borrow = function(input, callback) {
    $http({
      method: 'POST',
      url: '/api/items/'+ input.item + '/borrow',
      data: {
        duration: input.duration || 5, 
        message: input.message || 'Can I borrow this?'
      }
    })
    .then(callback)
    .catch(function(err) {
      console.log('Error Borrowing Item: ', err);
    });
  };
    var getAll = function(callback) {
    $http({
      method: 'GET',
      url: '/api/items/'
    })
    .then(callback)
    .catch(function(err) {
      console.log('Error Borrowing Item: ', err);
    });
  };

  return {
    borrow: borrow,
    getAll: getAll,
  };
});
