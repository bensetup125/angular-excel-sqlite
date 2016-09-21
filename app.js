var app = angular.module('cdg', [
	require('angular-route'),
	'angularUtils.directives.dirPagination',
	'ngCsvImport',
	'ngSanitize',
	'ngCsv'
]);

app.config(function($routeProvider){
	$routeProvider.when("/", {
		templateUrl : "views/import.html",
		controller : "importController",
        access: { requiredLogin: false }
	});

});
