
var waveDashboard = angular.module("waveDashboard", ['ngRoute', 'ui.bootstrap', 'dashboardCtrl', 'angularFileUpload']);

waveDashboard.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
		when('/unauthorized',                
			{templateUrl: 'partials/unauthorized.html'}).
		when('/manage',          
			{templateUrl: 'partials/manage.html'}).
	  otherwise({redirectTo: '/manage'});
	}]);

	