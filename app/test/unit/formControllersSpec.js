describe('formCtrl', function() {
	
	beforeEach(module('pf'));
	beforeEach(module('templates'));
	var $controller, $httpBackend, ApiModel, $scope;
	
	beforeEach(inject(function(_$controller_, _$httpBackend_, _ApiModel_) {
		$httpBackend = _$httpBackend_;
		ApiModel = _ApiModel_;
		$controller = _$controller_;
		$scope = {
			status:'', 
			obj:{id:1, title:'Gimme Fiction', tracks:11},
			resource:'Album',
			fields:['title', 'duration', 'rating'],
		};
		
		
	}));
	
	describe('$scope.initSettings', function() {
		it('should set status to init', function() {
			var controller = $controller('formCtrl', {$scope: $scope });
			$scope.initSettings();
			expect($scope.status).toEqual('init');
		});
		it('should initialize $scope.formObject', function() {
			var controller = $controller('formCtrl', {$scope: $scope });
			$scope.initSettings();
			expect($scope.formObject.title).toEqual($scope.obj.title);
		});
		it('should create empty properties if required form fields are undefined', function() {
			var controller = $controller('formCtrl', {$scope: $scope });	
			$scope.initSettings();
			expect($scope.formObject.duration).toEqual('');
			expect($scope.formObject.rating).toEqual('');
		});
	});
		
	describe('$scope.update', function() {
		it('should update the ApiModel and provide status messages', function() {
			var url = '/api/Album';
			$httpBackend.whenPOST(url).respond({id:1, title:'Gimme Fiction', tracks:11, genre:'ALT'});
			var controller = $controller('formCtrl', {$scope: $scope });
			$scope.update();
			expect($scope.status).toEqual('submitting');
			$httpBackend.flush();
			expect($scope.status).toEqual('submitted');
			expect($scope.submittedMessage).toEqual('Saved.');
		});
	});
	
	describe('$scope.refresh', function() {
		it('should trigger the afterSubmit method after 500ms', function() {
			var controller = $controller('formCtrl', {$scope: $scope });
			$scope.status = 'submitted';
			$scope.refreshed = false;
			$scope.afterSubmit = function() {$scope.refreshed = true; }
			$scope.refresh();
			expect($scope.refreshed).toEqual(false);
			setTimeout(function() {
				expect($scope.refreshed).toEqual(true);
			}, 500);
		});
		
		it('should not trigger the afterSubmit method when status !== \'submitted\'', function() {
			var controller = $controller('formCtrl', {$scope: $scope });
			$scope.status = 'init';
			$scope.refreshed = false;
			$scope.afterSubmit = function() {$scope.refreshed = true; }
			$scope.refresh();
			setTimeout(function() {
				expect($scope.refreshed).toEqual(false);
			}, 500);
		});
		
	});
});

describe('deleteItemCtrl', function() {
	
	beforeEach(module('pf'));
	
	var $controller, $httpBackend, ApiModel, $scope;
	
	beforeEach(inject(function(_$controller_, _$httpBackend_, _ApiModel_) {
		$httpBackend = _$httpBackend_;
		ApiModel = _ApiModel_;
		$controller = _$controller_;
		
		$scope = {
			status:'',
			obj:{id:31, fname:'Sweet', lname:'Jane'},
			helpers:{resource:'Author'},
		};
        var url = '/api/Author/31';
		var response = {id:31, fname:'Sweet', lname:'Jane'};
		$httpBackend.when('DELETE', url).respond(response);
		
	}));
	
	describe('$scope.init', function() {
		it('should set the status to init', function() {
			var controller = $controller('deleteItemCtrl', {$scope: $scope});
			$scope.init();
			expect($scope.status).toEqual('init');
		});
	});
	
	describe('$scope.del', function() {
		it('should delete the record and update the status', function() {
			var controller = $controller('deleteItemCtrl', {$scope: $scope});
			$scope.init();
			$scope.del();
			expect($scope.status).toEqual('submitting');
			$httpBackend.flush();
			expect($scope.status).toEqual('submitted');
			expect($scope.actionMessage).toEqual('Deleted.');
		});
	});
	
	it('should trigger the afterSubmit method after 500ms', function() {
		var controller = $controller('deleteItemCtrl', {$scope: $scope });
		$scope.status = 'submitted';
		$scope.refreshed = false;
		$scope.afterSubmit = function() {$scope.refreshed = true; }
		$scope.refresh();
		expect($scope.refreshed).toEqual(false);
		setTimeout(function() {
			expect($scope.refreshed).toEqual(true);
		}, 500);
	});
	
	it('should not trigger the afterSubmit method when status !== \'submitted\'', function() {
		var controller = $controller('deleteItemCtrl', {$scope: $scope });
		$scope.status = 'init';
		$scope.refreshed = false;
		$scope.afterSubmit = function() {$scope.refreshed = true; }
		$scope.refresh();
		setTimeout(function() {
			expect($scope.refreshed).toEqual(false);
		}, 500);
	});
});

describe('uploadFileCtrl', function() {
	
	beforeEach(module('pf'));
	
	var $controller, $httpBackend, ApiModel, $scope, fileUpload;
	
	beforeEach(inject(function(_$controller_, _$httpBackend_, _ApiModel_, _fileUpload_) {
		$httpBackend = _$httpBackend_;
		ApiModel = _ApiModel_;
		fileUpload = _fileUpload_;
		$controller = _$controller_;
		$scope = {};
	}));
	
	describe('$scope.init', function() {
		it('should set the status to init and initialize an empty formObject', function() {
			var controller = $controller('uploadFileCtrl', {$scope: $scope});
			$scope.init();
			expect($scope.status).toEqual('init');
			expect($scope.formObject.file).toEqual({});
		});
	});
	
	describe('$scope.upload', function() {
		it('should upload the file, update the status message, and trigger the refresh', function() {
			var instantfile = {name: 'Fugue in D Minor.txt', data: 'Must love organ'};
			var fd = new FormData();
			fd.append('name', instantfile.name);
			fd.append('data', instantfile.data);
			var response = [{filename:instantfile.name}];
			$httpBackend.expectPOST('/upload', fd).respond(response);
			
			var controller = $controller('uploadFileCtrl', {$scope: $scope});
			$scope.init();
			$scope.formObject.file = instantfile;
			$scope.refresh = function() {$scope.refreshed = true};
			$scope.upload();
			expect($scope.status).toEqual('submitting');
			$httpBackend.flush();
			expect($scope.status).toEqual('submitted');
			expect($scope.refreshed).toEqual(true);
			
		});
	});
});