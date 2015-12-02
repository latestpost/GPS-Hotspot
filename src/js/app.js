angular.module('GeoApp', [
  'ngRoute',
  'mobile-angular-ui',
  'GeoApp.controllers.Main',
  'GeoApp.services.Geolocation',
  'LocalStorageModule',
  'ngMap',
  'ngDonut'
])
.config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('geoStorage');
  }])

.config(function($routeProvider) {
  $routeProvider.when('/', {templateUrl:'home.html',  reloadOnSearch: false});
  $routeProvider.when('/hotspots', {templateUrl:'hotspots.html',  reloadOnSearch: false});
});