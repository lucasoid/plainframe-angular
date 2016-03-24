describe('listCtrl', function() {
	
	beforeEach(module('pf'));
	
	var fauxFilter = function(arg1, arg2, arg3, arg4) {
		return {arg1:arg1, arg2:arg2, arg3:arg3, arg4:arg4};
	}
	
	beforeEach(module(function($provide) {
		$provide.value('fauxFilter', fauxFilter);
	}));
			
	var $controller, ApiModel, $httpBackend, $scope;
	
	beforeEach(inject(function(_$controller_, _$httpBackend_, _ApiModel_) {
		$httpBackend = _$httpBackend_;
		ApiModel = _ApiModel_;
		$controller = _$controller_;
	}));
	
	describe('$scope.getCollection', function() {
		it('should fetch a collection and pass it to the callback', function() {
			var collectionurl = '/api/Player?page=1&rpp=5';
			var players = [
 			  {fname:'Jayson', lname:'Werth', position:'LF'},
 			  {fname:'Michael', lname:'Taylor', position:'CF'},
 			  {fname:'Bryce', lname:'Harper', position:'RF'},
 			  {fname:'Max', lname:'Scherzer', position:'P'},
 			  {fname:'Wilson', lname:'Ramos', position:'C'},
 	        ];
			$httpBackend.expectGET(collectionurl).respond(players);		
			
			$scope = {
				items:[],
				model:'Player',
				rpp:5,
				page:1,
			};
			var controller = $controller('listCtrl', {$scope:$scope})
			$scope.getCollection(function(result) {
				$scope.items = result;
			});
			expect($scope.items.length).toEqual(0);
			$httpBackend.flush();
			expect($scope.items.length).toEqual(5);
			expect($scope.items[0].position).toEqual('LF');
		});
		
		
	});
	
	describe('$scope.getCollectionCount', function() {
		it('should fetch a count and pass it to the callback', function() {
			var counturl = '/api/Player/count';
			$httpBackend.expectGET(counturl).respond({count:9});
			
			$scope = {
				model:'Player',
			};
			var controller = $controller('listCtrl', {$scope:$scope})
			$scope.getCollectionCount(function(result) {
				$scope.total = result;
			});
			$httpBackend.flush();
			expect($scope.total.count).toEqual(9);
		});
	});
	
	describe('$scope.refresh', function() {
		it('should set $scope.items, set $scope.total, call $scope.setNumPages, and initialize $scope.browseControlsMessage', function() {
			var collectionurl = '/api/Player?page=1&rpp=5';
			var players = [
 			  {fname:'Jayson', lname:'Werth', position:'LF'},
 			  {fname:'Michael', lname:'Taylor', position:'CF'},
 			  {fname:'Bryce', lname:'Harper', position:'RF'},
 			  {fname:'Max', lname:'Scherzer', position:'P'},
 			  {fname:'Wilson', lname:'Ramos', position:'C'},
 	        ];
			$httpBackend.expectGET(collectionurl).respond(players);
			
			var counturl = '/api/Player/count';
			$httpBackend.expectGET(counturl).respond({count:9});
			
			$scope = {
			  model:'Player',
			  rpp:5,
			  page:1,
			  browseControlsMessage: ['Test controls message', 'Another message'],
			  numPages:0,
			};
			var controller = $controller('listCtrl', {$scope:$scope});
			$scope.setNumPages = function() {
				$scope.numPages = 2;
			}
			$scope.refresh();
			$httpBackend.flush();
			expect($scope.items.length).toEqual(5);
			expect($scope.total.count).toEqual(9);
			expect($scope.numPages).toEqual(2);
			expect($scope.browseControlsMessage.length).toEqual(0);
		});
	});
	
	describe('$scope.toggleSort', function() {
		it('should reverse the supplied sort order from asc to desc', function() {
			$scope = {};
			var controller = $controller('listCtrl', {$scope:$scope});
			var sortlevel = {orderby:'fname', sort:'asc'};
			$scope.toggleSort(sortlevel);
			expect(sortlevel.sort).toEqual('desc');
		});
	});
	
	describe('$scope.getPresets', function() {
		it('should fetch the presets for a particular user and controllername and pass them to a callback', function() {
			var filt = [{field:'userid', operator:'equals', value:'mrizzo'}, {field:'controller', operator:'equals', value:'playerList'}];
			var sort = [{orderby:'primeflag', sort:'desc'}];
			var url = '/api/preset?filters=' + encodeURI(JSON.stringify(filt)) + '&sortlevels=' + encodeURI(JSON.stringify(sort));
			
			$httpBackend.expectGET(url).respond([{userid:'mrizzo', controller:'playerList', name:'default', preset:{}}]);
			$scope = {me:{userid:'mrizzo'}, controllername:'playerList'};
			controller = $controller('listCtrl', {$scope:$scope});
			$scope.getPresets(function(result) {
				$scope.presets = result;
			});
			$httpBackend.flush();
			expect($scope.presets.length).toEqual(1);
			expect($scope.presets[0].name).toEqual('default');
		});
	});
	
	describe('$scope.savePreset', function() {
		
		it('should save a preset, call the getPresets() method, and create a confirmation message', function() {
			$scope = {
				me:{userid:'mrizzo'},
				columns:[
				 {key:'fname', hidden:false},
				 {key:'lname', hidden:false},
				 {key:'position', hidden:true},
				],
				rpp:5,
				filters:[],
				sortlevels:[],
			}
			var url = '/api/Preset';
			var preset = {userid:'mrizzo', controller:'playerList', name:'default', preset:{}};
			$httpBackend.whenPOST(url).respond(preset);
			var controller = $controller('listCtrl', {$scope:$scope});
			$scope.addBrowseControlsMessage = function(msg) {
				$scope.browseControlsMessage = msg;
			}
			$scope.getPresets = function(callback) {
				callback([preset]);
			}
			
			$scope.savePreset('default');
			$httpBackend.flush();
			expect($scope.presets.length).toEqual(1);
			expect($scope.presets[0].name).toEqual('default');
			expect($scope.browseControlsMessage).toEqual('View saved.');
			
		});
	});
	
	describe('$scope.deletePreset', function() {
		it('should delete the preset, remove it from the list of presets, and add a confirmation message', function() {
			var preset1 = {id:1, userid:'mrizzo', controller:'playerList', name:'default', preset:{}}; 
			var preset2 = {id:2, userid:'mrizzo', controller:'playerList', name:'other', preset:{}}; 
			$scope = {
				presets:[preset1, preset2],
			}
			var url = '/api/Preset/1';
			$httpBackend.expectDELETE(url).respond(preset1);
			
			var controller = $controller('listCtrl', {$scope:$scope});
			$scope.addBrowseControlsMessage = function(msg) {
				$scope.browseControlsMessage = msg;
			}
			$scope.deletePreset(preset1, 0);
			$httpBackend.flush();
			expect($scope.presets.length).toEqual(1);
			expect($scope.presets[0].name).toEqual('other');
			expect($scope.browseControlsMessage).toEqual('View deleted.');
			
		});
	});
	
	describe('$scope.applyPreset', function() {
		it('should set rpp, filters, sortlevels, and hide/unhide columns', function() {
			$scope = {
				rpp:100,
				filters:[],
				sortlevels:[],
				columns:[
				 {key:'fname', hidden:false},
				 {key:'lname', hidden:false},
				 {key:'position', hidden:true},
				],
			};
			
			
			var controller = $controller('listCtrl', {$scope:$scope});
			
			var preset = {id:1, userid:'mrizzo', controller:'playerList', name:'default', preset:JSON.stringify({rpp:5, filters:'faux filters', sortlevels:'faux sortlevels', columns:['fname']})};
			$scope.applyPreset(preset);
			expect($scope.filters).toEqual('faux filters');
			expect($scope.sortlevels).toEqual('faux sortlevels');
			expect($scope.rpp).toEqual(5);
			expect($scope.columns[1].hidden).toEqual(true);
		});
	});
	
	describe('$scope.setDefaultPreset', function() {
		it('should loop through all $scope.presets and set a single prime flag, then display a confirmation message', function() {
			var preset1 = {id:1, userid:'mrizzo', controller:'playerList', name:'default', preset:JSON.stringify({rpp:5, filters:'faux filters', sortlevels:'faux sortlevels', columns:['fname']}), primeflag:0};
			var preset2 = {id:2, userid:'mrizzo', controller:'playerList', name:'default', preset:JSON.stringify({rpp:5, filters:'faux filters', sortlevels:'faux sortlevels', columns:['lname']}), primeflag:1};
			
			$scope = {
				presets:[preset1, preset2],
				me:{userid:'mrizzo'},
			};
			
			var url = '/api/Preset';
			$httpBackend.expectPOST(url).respond({});			
			var url = '/api/Preset';
			$httpBackend.expectPOST(url).respond({});
			
			var controller = $controller('listCtrl', {$scope:$scope});
			
			$scope.addBrowseControlsMessage = function(msg) {
				$scope.browseControlsMessage = msg;
			}
			
			$scope.getPresets = function(callback) {
				var first = preset1;
				var second = preset2;
				first.primeflag = '1';
				second.primeflag = '0';
				callback([first, second]);
			}
			
			$scope.setDefaultPreset(0);
			
			$httpBackend.flush();
			expect($scope.presets[0].primeflag).toEqual('1');
			expect($scope.presets[1].primeflag).toEqual('0');
			expect($scope.browseControlsMessage).toEqual('Default view changed.');
		});
	});
	
	describe('$scope.initSettings', function() {
		
		beforeEach(inject(function() {
			$httpBackend.expectGET('/api/me').respond({userid:'mrizzo'});
			
			var filt = [{field:'userid', operator:'equals', value:'mrizzo'}, {field:'controller', operator:'equals', value:'playerList'}];
			var sort = [{orderby:'primeflag', sort:'desc'}];
			var url = '/api/preset?filters=' + encodeURI(JSON.stringify(filt)) + '&sortlevels=' + encodeURI(JSON.stringify(sort));
			var data = [
			  {
				  userid:'mrizzo', 
				  controller:'playerList', 
				  name:'default', 
				  preset:JSON.stringify({rpp:5, filters:[], sortlevels:[], columns:['fname']}),
				  primeflag:'1'
			  }
			];
			
			$httpBackend.expectGET(url).respond(data);
			$scope.controllername = 'playerList';
			
		}));
		
		it('should initialize total, numPages, and browseControlsMessage', function() {
			controller = $controller('listCtrl', {$scope:$scope});
			$scope.refresh = function() {$scope.refreshed = true; }
			$scope.applyPreset = function() {$scope.applied = true; }
			$scope.initSettings();
			$httpBackend.flush();
			expect($scope.total.count).toEqual(0);
			expect($scope.numPages).toEqual(0);
			expect($scope.browseControlsMessage.length).toEqual(0);
		});
		
		it('should set $scope.me, $scope.presets, $scope.page, $scope.rpp, $scope.filters, and $scope.sortlevels', function() {
			controller = $controller('listCtrl', {$scope:$scope});
			$scope.refresh = function() {$scope.refreshed = true; }
			$scope.applyPreset = function() {$scope.applied = true; }
			$scope.initSettings();
			$httpBackend.flush();
			expect($scope.me.userid).toEqual('mrizzo');
			expect($scope.presets.length).toEqual(1);
			expect($scope.page).toEqual(1);
			expect($scope.rpp).toEqual(100);
			expect($scope.filters.length).toEqual(1);
			expect($scope.sortlevels.length).toEqual(0);
			
			
		});
		it('should apply a preset if there is a default', function() {
			controller = $controller('listCtrl', {$scope:$scope});
			$scope.refresh = function() {$scope.refreshed = true; }
			$scope.applyPreset = function() {$scope.applied = true; }
			$scope.initSettings();
			$httpBackend.flush();
			expect($scope.applied).toEqual(true);
		});
		it('should call the $scope.refresh method', function() {
			controller = $controller('listCtrl', {$scope:$scope});
			$scope.refresh = function() {$scope.refreshed = true; }
			$scope.applyPreset = function() {$scope.applied = true; }
			$scope.initSettings();
			$httpBackend.flush();
			expect($scope.refreshed).toEqual(true);
		});
	});
	
	describe('$scope.setColumnType', function() {
		it('should set a filter\'s column type based on the corresponding column', function() {
			$scope = {
				columns:[
				    {key:'fname', type:'string'},
				    {key:'lname', type:'string'},
				    {key:'position', type:'string'},
				],
				filters:[
				    {field:'fname', operator:'equals', value:'Bryce'},
				]
			};
			var controller = $controller('listCtrl', {$scope:$scope});
			$scope.setColumnType($scope.filters[0]);
			expect($scope.filters[0].columnType).toEqual('string');
		});
	});
	
	describe('$scope.initVal', function() {
		it('should intiialize boolean values as 1', function() {
			$scope = {
				filters:[
				    {field:'active', operator:'equals', value:'', columnType:'boolean'},
				    {field:'fname', operator:'equals', value:'', columnType:'string'},
				]
			};
			var controller = $controller('listCtrl', {$scope:$scope});
			$scope.initVal($scope.filters[0]);
			expect($scope.filters[0].value).toEqual('1');
			$scope.initVal($scope.filters[1]);
			expect($scope.filters[1].value).toEqual('');
		});
	});
	
	describe('$scope.getColumnData', function() {
		
		beforeEach(function() {
			
		});
		
		it('should determine whether to apply a filter and which values to pass', function() {
			var controller = $controller('listCtrl', {$scope:$scope});
			var item = {id:'11', fname:'Ryan', lname:'Zimmerman', position:'1B', active:'1', since:'2005-01-01'};
			
			var column, datum;
			//pass a static value
			column = {key:'position', label:'Position', ngFilter:{name:'faux', arg:'the argument'}};
			datum = $scope.getColumnData(item, column);
			expect(datum.arg1).toEqual('1B');
			expect(datum.arg2).toEqual('the argument');
			
			//pass the item object
			column = {key:'position', label:'Position', ngFilter:{name:'faux', passItem:true}};
			datum = $scope.getColumnData(item, column);
			expect(datum.arg1).toEqual('1B');
			expect(datum.arg2.fname).toEqual('Ryan');
			
			//pass a reference to another column
			column = {key:'position', label:'Position', ngFilter:{name:'faux', ref:'id'}};
			datum = $scope.getColumnData(item, column);
			expect(datum.arg1).toEqual('1B');
			expect(datum.arg2).toEqual('11');
			
			//pass the item object, a static value, and a reference to another column
			column = {key:'position', label:'Position', ngFilter:{name:'faux', passItem:true, arg:'the argument', ref:'id'}};
			datum = $scope.getColumnData(item, column);
			expect(datum.arg1).toEqual('1B');
			expect(datum.arg2.fname).toEqual('Ryan');
			expect(datum.arg3).toEqual('11');
			expect(datum.arg4).toEqual('the argument');
			
			//pass the item object and a static value
			column = {key:'position', label:'Position', ngFilter:{name:'faux', passItem:true, arg:'the argument' }};
			datum = $scope.getColumnData(item, column);
			expect(datum.arg1).toEqual('1B');
			expect(datum.arg2.fname).toEqual('Ryan');
			expect(datum.arg3).toEqual('the argument');
			
			//pass the item object and a reference to another column
			column = {key:'position', label:'Position', ngFilter:{name:'faux', passItem:true, ref:'id'}};
			datum = $scope.getColumnData(item, column);
			expect(datum.arg1).toEqual('1B');
			expect(datum.arg2.fname).toEqual('Ryan');
			expect(datum.arg3).toEqual('11');
			
			//pass a static value and a reference to another column
			column = {key:'position', label:'Position', ngFilter:{name:'faux', arg:'the argument', ref:'id'}};
			datum = $scope.getColumnData(item, column);
			expect(datum.arg1).toEqual('1B');
			expect(datum.arg2).toEqual('11');
			expect(datum.arg3).toEqual('the argument');
			
			//pass no arguments
			column = {key:'position', label:'Position', ngFilter:{name:'faux'}};
			datum = $scope.getColumnData(item, column);
			expect(datum.arg1).toEqual('1B');
			
			//no filtering
			column = {key:'position', label:'Position'};
			datum = $scope.getColumnData(item, column);
			expect(datum).toEqual('1B');
		});
	});
});

describe('listCheckboxCtrl', function() {
	
	beforeEach(module('pf'));
	var $controller, $scope;
	
	beforeEach(inject(function(_$controller_) {
		$controller = _$controller_;
		$scope = {
		   allChecked:false,
		   items:[
		     {id:1, checked:false},
		     {id:2, checked:true},
		     {id:3, checked:false},
		   ], 
		 };
	}));
	
  describe('$scope.checkAll', function() {
	 it('should toggle $scope.allChecked and set $scope.items[x].checked to true', function() {
		 var controller = $controller('listCheckboxCtrl', {$scope:$scope});
		 $scope.checkAll();
		 expect($scope.allChecked).toEqual(true);
		 expect($scope.items[0].checked).toEqual(true);
	 });
  });
  
  describe('$scope.updateChecked', function() {
	  it('should count  the checked items and set $scope.countChecked', function() {
		 var controller = $controller('listCheckboxCtrl', {$scope:$scope});
		 $scope.updateChecked();
		 expect($scope.allChecked).toEqual(false);
		 expect($scope.countChecked).toEqual(1);
	  });
  });
});