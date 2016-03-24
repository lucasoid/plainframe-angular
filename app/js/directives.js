
pf.directive('browseControls', [function() {
	return {
		templateUrl:'app/partials/browse-controls.html'
	};
}]);

pf.directive('popupForm', ['$timeout', function($timeout) {
	return {
		restrict:'E',
		scope:{obj:'=',helpers:'=', afterSubmit:'&'},
		link: function(scope, element, attrs) {
			scope.getTemplate = function() {
				return 'app/partials/forms/' + attrs.template + '.html';
			}
			scope.initObject = angular.copy(scope.obj);
		},
		template:'<div class="inline" ng-include="getTemplate()"></div>',
	};
}]);

pf.directive('datepicker', ['$parse', function($parse) {
	return function(scope, element, attrs) {
		var ngModel = $parse(attrs.ngModel);
		element.datepicker({
			dateFormat: "yy-mm-dd",
			onSelect: function(dateText, inst) {
				scope.$apply(function(scope) {
					ngModel.assign(scope, dateText);
				});
			},
		});
	}
}]);

pf.directive('exportResults', [function() {
	return {
		restrict: 'E',
		templateUrl:'app/partials/forms/export-results.html',
	};
}]);

pf.directive('fileModel', ['$parse', function($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;
			element.bind('change', function() {
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	}
}]);