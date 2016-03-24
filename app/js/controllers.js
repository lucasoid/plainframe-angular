var pfControllers = angular.module('pfControllers', []);

pfControllers.controller('pfCtrl', ['$scope', '$filter', '$timeout', 'Me', 'ApiModel',
  function($scope, $filter, $timeout, Me, ApiModel) {
	$scope.title = 'Plainframe';
	$scope.activeTab = 'me';	
	$scope.init = function() {
		
		 $scope.me = Me.get({}, function() {
		
		 });
	};
	
	$scope.init();
	
	$scope.search = function(searchterms) {
		ApiModel.collection({
			resource:'Book', 
			filters:JSON.stringify([{field:'title', operator:'contains', value:searchterms}]),
			rpp:20,
			page:1,
		}, function(results) {
			$scope.searchResults = results;
		}, function(results) {
			
		});
	}	
}
	
]);

pfControllers.controller('dashboardCtrl', ['$scope',
  function($scope) {
	$scope.$parent.title = 'Home | Plainframe';
  }
]);

pfControllers.controller('bookDetailCtrl', ['$scope', '$controller', '$routeParams', 'ApiModel', 
   function($scope, $controller, $routeParams, ApiModel) {	
 	$scope.init = function() {
		$scope.$parent.title = 'Plainframe';
 		$scope.getBook(function(result) {
			$scope.$parent.title = result.title + ' | Plainframe';
 		});
 		$scope.$parent.activeTab = 'books';
 		$scope.renderActiveTab('basic');
 	};
 	
 	$scope.refresh = function() {
 		$scope.init();
 	}
 	$scope.getBook = function(callback) {
		$scope.book = {};
 		ApiModel.single({resource:'Book', id:$routeParams.id}, function(result) {
 			$scope.book = result;
 			
 			if(callback != undefined) {
 				callback(result);
 			}
	 		
 		}, function() {
		$scope.book = {title:'Record not found'};
		});
 	}
 	
 	$scope.renderActiveTab = function(tab) {
 		$scope.display = tab;
 	}
 	
 	$scope.init();
  }                             
]);


pfControllers.controller('uploadDetailCtrl', ['$scope', '$controller', '$routeParams', 'ApiModel', 
   function($scope, $controller, $routeParams, ApiModel) {	
 	$scope.init = function() {
 		$scope.$parent.title = 'Plainframe';
 		$scope.getUpload(function(result) {
			$scope.$parent.title = result.title + ' | Plainframe';
 		});
 		$scope.$parent.activeTab = 'uploads';
 		$scope.renderActiveTab('basic');
 	};
 	
 	$scope.refresh = function() {
 		$scope.init();
 	}
 	$scope.getUpload = function(callback) {
		$scope.upload = {};
 		ApiModel.single({resource:'Upload', id:$routeParams.id}, function(result) {
 			$scope.upload = result;
 			$scope.$parent.title = $scope.upload.title + ' | Plainframe';
 			if(callback != undefined) {
 				callback(result);
 			}
	 		
 		}, function() {
			$scope.upload = {title:'Record not found'};
		});
 	}
 	
 	$scope.renderActiveTab = function(tab) {
 		$scope.display = tab;
 	}
 	
 	$scope.init();
  }                             
]);