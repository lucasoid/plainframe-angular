var pfServices = angular.module('pfServices', ['ngResource']);

pfServices.factory('ApiModel', ['$resource', function($resource){
	return $resource('/api/:resource/:id', {}, {
		collection: { method: 'GET', params:{resource:'@resource', id:''}, isArray:true},
		collectionCount: {method: 'GET', params:{resource:'@resource', id:'count'}, isArray:false},
		single: { method: 'GET', params:{resource:'@resource', id:'@id'}, isArray:false},
	});
}]);

pfServices.factory('Me', ['$resource', function($resource) {
	return $resource('/api/me', {});
}]);

pfServices.factory('fileUpload', ['$resource', function($resource) {
	return $resource('/upload/:id', {}, {
		upload: { 
			method:'POST',
			transformRequest:angular.identity,
			headers:{'Content-Type':undefined},
			isArray: true,
	    },
	});
}]);
