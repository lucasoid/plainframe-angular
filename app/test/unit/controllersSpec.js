describe('pfCtrl', function() {
	
	beforeEach(module('pf'));
	
	var $controller, $httpBackend, ApiModel, Me;
	
	beforeEach(inject(function(_$controller_, _$httpBackend_, _ApiModel_, Me) {
		$httpBackend = _$httpBackend_;
		ApiModel = _ApiModel_;
		$controller = _$controller_;
		$httpBackend.whenGET('/api/me').respond({userid:'jsbach', name:'Johann', role:'admin'});
	}));
	
	describe('$scope.init', function() {
		it('should initialize $scope.me', function() {
			var $scope = {};
			var controller = $controller('pfCtrl', {$scope: $scope });
			$httpBackend.flush();
			expect($scope.me.userid).toEqual('jsbach');
		});
	});
});
describe('dashboardCtrl', function() {
	
	beforeEach(module('pf'));
	
});
