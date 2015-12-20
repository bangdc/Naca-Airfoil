'use strict';
angular.module('nacaAirfoilApp', [
	'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
   	'ngSanitize',
	  'ngTouch',
    'gridshore.c3js.chart'
]).config(function ($routeProvider) {
    $routeProvider
      .when('/', {
      	templateUrl: 'view.html',
        controller: 'AppCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });