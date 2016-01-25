//$(document).foundation();
//
//
//var baseURL = 'https://hiring-day.firebaseio.com/'
/**
 * Created by Answer1215 on 11/9/2014.
 */

var app = angular.module('app', ['ui.router','firebase', 'oc.lazyLoad']);

app.constant('FIREBASE_URI', 'https://hiring-day.firebaseio.com/');

app.config(function($stateProvider){
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'public/login.tmpl.html',
            controller: 'LoginCtrl',
            resolve: {
                'login@': function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name: "login",  //module name is "store"
                            files: ["public/js/login.js",
                            'bower_components/firebase-simple-login/firebase-simple-login.js']
                        }
                    )
                }
        }});
});

app.controller('MainCtrl', ['$scope', 'ItemsService', 'UserService',function ($scope, ItemsService, UserService) {
    $scope.newItem = { name: '', description: '', count: 0 };
    $scope.newUser = {name: ''};
    $scope.currentItem = null;
    $scope.isUpdated = false;

    $scope.items = ItemsService.getItems();
    $scope.users = UserService.getUsers();

    $scope.items.$on('change', function(){
        if(!$scope.isUpdated){return;}
        console.log("ITEMS CHANGE");
    });

    $scope.items.$on('loaded', function(){
        console.log("ITEMS LOADED");
    });

    //Deattach the change event from the items
    //$scope.items.$off('change');


    $scope.addItem = function () {
        ItemsService.addItem(angular.copy($scope.newItem));
        $scope.newItem = { name: '', description: '', count: 0 };
    };

    $scope.updateItem = function (id){
        $scope.isUpdated = true;
        ItemsService.updateItem(id);
    };

    $scope.removeItem = function (id) {
        ItemsService.removeItem(id);
    };

    $scope.addUser = function(){
        UserService.addUser(angular.copy($scope.newUser));
        $scope.newUser = {name: ''};
    }
}]);

app.factory('UserService', ['$firebase', 'FIREBASE_URI', function ($firebase, FIREBASE_URI) {
    var userRef = new Firebase(FIREBASE_URI + 'users');
    var users = $firebase(userRef);

    var getUsers = function () {
        return users;
    };

    var addUser = function (user) {
        users.$add(user);
    };


    return {
        getUsers: getUsers,
        addUser: addUser
    }
}]);

app.factory('ItemsService', ['$firebase', 'FIREBASE_URI', function ($firebase, FIREBASE_URI) {
    var ref = new Firebase(FIREBASE_URI + 'items');
    var items = $firebase(ref);

    var getItems = function () {
        return items;
    };

    var addItem = function (item) {
        items.$add(item);
    };

    var updateItem = function (id) {
        items.$save(id);
    };

    var removeItem = function (id) {
        items.$remove(id);
    };

    return {
        getItems: getItems,
        addItem: addItem,
        updateItem: updateItem,
        removeItem: removeItem
    }
}]);