pfControllers.controller('formCtrl', ['$scope', '$controller', '$timeout', 'ApiModel', 
  function($scope, $controller, $timeout, ApiModel) {
   	$scope.initSettings = function() {
   		$scope.status = 'init';
   		if($scope.resource == undefined) {
   			console.log('$scope.resource is undefined');
   		}
   		if($scope.fields == undefined) {
   			console.log('$scope.fields is undefined');
   		}
   		$scope.formObject = angular.copy($scope.obj);
   		for(var i = 0; i < $scope.fields.length; i++) {
   			$scope.formObject[$scope.fields[i]] = $scope.formObject[$scope.fields[i]] == undefined ? '' : $scope.formObject[$scope.fields[i]]; 
   		}
   	}
   
   $scope.update = function() {
	$scope.status = 'submitting';
	var model = new ApiModel($scope.formObject);
	model.$save({resource:$scope.resource}, function(result) {
   		$scope.submittedMessage = 'Saved.';	
   		$scope.status = 'submitted';
   	}, function() {
   		$scope.submittedMessage = 'There was an error saving the information.';
   		$scope.status = 'submitted';
   	});
   }
       
   $scope.refresh = function() {
	setTimeout(function() {
 			if($scope.status == 'submitted') {
 				$scope.afterSubmit();
 			}
 		}, 500);
   	}
   }                                           
]);

pfControllers.controller('bookEditCtrl', ['$scope', '$controller', 'ApiModel', 
  function($scope, $controller, ApiModel) {
	angular.extend(this, $controller('formCtrl', {$scope: $scope}));
	$scope.init = function() {
		$scope.resource = 'Book';
		$scope.fields = ['title', 'author', 'length', 'published'];
		$scope.startTinyMCE = true;
		$scope.tinymceOptions = {
    		  inline: false,
    		  plugins : 'advlist autolink link image lists charmap print preview',
    		  skin: 'lightgray',
    		  theme : 'modern'
		};
		$scope.initSettings();
	}
}                                            
]);

pfControllers.controller('deleteItemCtrl', ['$scope', '$controller', 'ApiModel',
  function($scope, $controller, ApiModel) {
	$scope.init = function() {
		$scope.status = 'init';
	}
	
	$scope.del = function() {
		
		$scope.status = 'submitting';
		
		var model = new ApiModel($scope.obj);
		
		model.$delete({
			resource:$scope.helpers.resource,
			id:$scope.obj.id
		}, function(result) {
			$scope.actionMessage = 'Deleted.';
			$scope.status = 'submitted';
		}, function(result) {
			$scope.actionMessage = 'Sorry, there was an error deleting this record.';
			$scope.status = 'submitted';
		});
	}
	
	$scope.refresh = function() {
		if($scope.status == 'submitted') {
			setTimeout(function() {
				$scope.afterSubmit();
			}, 500);
		}
	}
}]);

pfControllers.controller('uploadFileCtrl', ['$scope', '$controller', 'fileUpload', 'ApiModel', 
function($scope, $controller, fileUpload, ApiModel) {
	
	$scope.init = function() {
		$scope.status = 'init';
		$scope.formObject = {};
		$scope.formObject.file = {};
		$scope.canUpload = window.FormData !== undefined;
	}
	
	$scope.upload = function() {
	  $scope.status = 'submitting';
 	  filename = $scope.formObject.file.name;
 	  var data = {
 	    file:$scope.formObject.file,
 	  };
 	  var fd = new FormData();
 	  for(var key in data) {
 		fd.append(key, data[key]);
 	  }
 	  
 	  fileUpload.upload(fd, function(result) {
 		$scope.submittedMessage = 'Saved.';
		$scope.status = 'submitted';
		$scope.refresh();
 	  }, function(result) {
 		$scope.submittedMessage = 'There was an error saving the file. ' + result.data;
 		$scope.status = 'submitted';
      });
	}
	
	$scope.refresh = function() {
		setTimeout(function() {
 			if($scope.status == 'submitted') {
 				$scope.afterSubmit();
 			}
 		}, 500);
	}
	
  }                                        
]);


