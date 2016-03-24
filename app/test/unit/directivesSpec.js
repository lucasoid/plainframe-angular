describe('Directives: popup-form', function() {
	
	var $compile,
	    $rootScope,
	    elm;
	
	beforeEach(module('pf'));
	beforeEach(module('templates'));
		
	beforeEach(inject(function(_$compile_, _$rootScope_) {
		scope = _$rootScope_.$new();
		$compile = _$compile_;
	}));
	
	it('should return the correct form template with the scope objects populated', function() {
		var template = 'test';
		scope.formObject = {property1:'red', property2:'orange'};
		scope.helpers = {resource:'Colors', 'new':false};
		scope.sayHello = function() {scope.msg = 'Hello';}
		elm = angular.element('<popup-form template="test" obj="formObject" helpers="helpers" after-submit="sayHello()"></popup-form>');
		$compile(elm)(scope);
		scope.$digest();
		var inputs = elm.find('input');
		expect(inputs.length).toEqual(3);
		isolate = elm.isolateScope();
		isolate.afterSubmit();
		expect(isolate.obj.property1).toEqual('red');
		expect(isolate.helpers.resource).toEqual('Colors');
		expect(scope.msg).toEqual('Hello');
	});
});