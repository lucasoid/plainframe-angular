var pf = angular.module('pf', [
  'ngRoute',
  'ngSanitize',
  'pfControllers',
  'pfFilters',
  'pfServices',
  'angularModalService',
  'ui.tinymce',
]);

pf.config(['$routeProvider', function($routeProvider) {
	
	$routeProvider.
	  when('/books', {
		  templateUrl: '/app/partials/browse-list.html',
		  controller: 'bookListCtrl'
	  }).
	  when('/books/:id', {
		  templateUrl: '/app/partials/book-details.html',
		  controller: 'bookDetailCtrl'
	  }).
	  when('/uploads', {
		  templateUrl: '/app/partials/browse-list.html',
		  controller: 'uploadListCtrl'
	  }).
	  when('/uploads/:id', {
		  templateUrl: '/app/partials/upload-details.html',
		  controller:'uploadDetailCtrl',
	  }).
	  when('/home', {
		  templateUrl:'/app/partials/dashboard.html',
		  controller:'dashboardCtrl',
	  }).
	  otherwise({
		  redirectTo: '/home'
	  });
}]);

