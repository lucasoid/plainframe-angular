pfControllers.controller('listCtrl', ['$scope', '$filter', '$timeout', '$q', 'Me', 'ApiModel', 
  function($scope, $filter, $timeout, $q, Me, ApiModel) {
	
	$scope.getCollection = function(callback) {
		$scope.rpp = $scope.rpp < 1001 ? $scope.rpp : 1000;
    	ApiModel.collection({
    		resource:$scope.model,
        	page: $scope.page,
        	rpp: $scope.rpp,
        	filters: JSON.stringify($scope.filters),
        	sortlevels: JSON.stringify($scope.sortlevels),
        }, function(result) {
        	callback(result);
        });
    };
    
    $scope.getCollectionCount = function(callback) {
    	ApiModel.collectionCount({
        	resource:$scope.model,
    		filters: JSON.stringify($scope.filters),
        }, function(result) {
        	callback(result);
        });
    }
    
    $scope.refresh = function() {
    	$scope.loading = true;
    	$scope.getCollection(function(result) {
    		$scope.items = result;
    		$scope.loading = false;
    	});
    	$scope.getCollectionCount(function(result) {
    		$scope.total = result;
    		if($scope.total.count != undefined) {
				var count = parseInt($scope.total.count);        		
            	$scope.numPages = $scope.rpp != '' && $scope.rpp != undefined && $scope.rpp != 0 ? Math.ceil(count/$scope.rpp) : 0;
    		}
    		else {
    			$scope.numPages = 0;
    		}
    	});
    	
    	$scope.browseControlsMessage = [];
    };
    
       
    $scope.toggleSort = function(sortLevel) {
    	sortLevel.sort = sortLevel.sort.toLowerCase() == 'asc' ? 'desc' : 'asc' ;
    }
    
    $scope.getPresets = function(callback) {
    	ApiModel.collection({
    		resource: 'preset',
    		sortlevels: JSON.stringify([
          	  {orderby:'primeflag', sort:'desc'}                          
          	]),
        	filters: JSON.stringify([
        	  {field:'userid', operator:'equals', value:$scope.me.userid},
        	  {field:'controller', operator:'equals', value:$scope.controllername},
        	]),
        }, function(result) {
        	callback(result);
        });
    }
    
    $scope.savePreset = function(name) {
    	var cols = [];
    	for(i = 0; i < $scope.columns.length; i++) {
    		if($scope.columns[i].hidden === false) {
    			cols.push($scope.columns[i].key);
    		}
    	}
    	var settings = {
			userid: $scope.me.userid,
    		controller: $scope.controllername,
    		preset: JSON.stringify({rpp: $scope.rpp, filters:$scope.filters, sortlevels: $scope.sortlevels, columns:cols}),
    		primeflag: '0',
    		name: name,
        };
    	
    	var preset = new ApiModel(settings);
    	
    	preset.$save({resource:'Preset'}, function() {
    		$scope.getPresets(function(result) {
    			$scope.presets = result;
    			$scope.addBrowseControlsMessage('View saved.');
    			$scope.showSavePreset = false;
    			$scope.newPresetName = '';
    		});
    	});
    }
    
    $scope.deletePreset = function(settings, index) {
    	var preset = new ApiModel(settings);
    	preset.$delete({resource:'Preset', id:settings.id});
    	$scope.presets.splice(index, 1);
    	$scope.addBrowseControlsMessage('View deleted.');
    }
    
    $scope.applyPreset = function(preset) {
    	settings = JSON.parse(preset.preset);
    	$scope.rpp = settings.rpp != undefined ? settings.rpp : $scope.rpp;
    	$scope.filters = settings.filters != undefined ? settings.filters : $scope.filters;
    	$scope.sortlevels = settings.sortlevels != undefined ? settings.sortlevels : $scope.sortlevels;
    	    	
		for(i = 0; i < $scope.columns.length; i++) {
			if(settings.columns != undefined && settings.columns.length) {
				$scope.columns[i].hidden = true;
				for(j = 0; j < settings.columns.length; j++) {
					if($scope.columns[i].key == settings.columns[j]) {
						$scope.columns[i].hidden = false;
					} 
				}
			}
			else {
				$scope.columns[i].hidden = false;
			}
		}
    }

    $scope.setDefaultPreset = function(index) {
    	var deferred = $q.defer();
		var saves = [];
		
    	for(i = 0; i < $scope.presets.length; i++) {
			var prime = 0;
			if(i == index) {
				prime = $scope.presets[i].primeflag == 1 ? 0 : 1;
			}
			var preset = new ApiModel({id:$scope.presets[i].id, primeflag:prime});
			var saved = preset.$save({resource:'Preset'});
			saves.push(saved);
    	}
		
    	$q.all(saves).then(function(result) {
			$scope.addBrowseControlsMessage('Default view changed.');
			$scope.getPresets(function(result) {
				$scope.presets = result;
			});	
		});
    }
    
    $scope.addBrowseControlsMessage = function(msg) {
    	var maxLength = 5;
    	if($scope.browseControlsMessage.length >= maxLength) {
    		var del = $scope.browseControlsMessage.length - maxLength;
    		$scope.browseControlsMessage.splice(0, del, msg);
    	}
    	else {
    		$scope.browseControlsMessage.push(msg);	
    	}
    }
   
    $scope.initSettings = function() {
    	$scope.total = {count:0};
    	$scope.numPages = 0;
    	$scope.browseControlsMessage = [];
    	//defer fetching until the promises have been fulfilled
    	Me.get({}, function(me) {
    		$scope.me = me;
    		$scope.getPresets(function(result) {
    			$scope.presets = result;
    			$scope.page = 1;
            	$scope.rpp = $scope.rpp == undefined ? 100 : $scope.rpp;
            	if($scope.filters == undefined) {
            		$scope.filters = [{field:'', operator:'', value:'' }];
            	}
            	$scope.defaultOrderBy = $scope.defaultOrderBy == undefined ? '' : $scope.defaultOrderBy;
            	$scope.sortlevels = $scope.defaultOrderBy && $scope.defaultSort ? [{orderby:$scope.defaultOrderBy, sort:$scope.defaultSort}] : [];
            	if($scope.presets[0] != undefined && $scope.presets[0].primeflag == '1') {
            		$scope.applyPreset($scope.presets[0]);
            	}
            	$scope.refresh();
    		});
    	});
    }
    
    $scope.filterOperators = {
    	boolean:[
    	  {key:'equals', label:'yes'},
    	  {key:'notequals', label:'no'},
		],
		aggBoolean:[
		  {key:'equals', label:'yes'},
		  {key:'notequals', label:'no'},
		],
		date:[
		  {key:'gt', label:'after'},
		  {key:'lt', label:'before'},
		  {key:'equals', label:'equals'},
		  {key:'notequals', label:'does not equal'},
		],
		number:[
		  {key:'gt', label:'greater than'},
		  {key:'lt', label:'less than'},
		  {key:'equals', label:'equals'},
		  {key:'notequals', label:'does not equal'},
		],
		aggNumber:[
		  {key:'gt', label:'greater than'},
		  {key:'lt', label:'less than'},
		  {key:'equals', label:'equals'},
		  {key:'notequals', label:'does not equal'},
		],
		string:[
		  {key:'begins', label:'begins with'},
		  {key:'contains', label:'contains'},
		  {key:'notcontains', label:'does not contain'},
		  {key:'equals', label:'equals'},
		  {key:'notequals', label:'does not equal'},
		  {key:'empty', label:'is empty'},
		  {key:'notempty', label:'is not empty'},
		],
		aggString:[
		  {key:'begins', label:'begins with'},
		  {key:'contains', label:'contains'},
		  {key:'notcontains', label:'does not contain'},
		  {key:'equals', label:'equals'},
		  {key:'notequals', label:'does not equal'},
		  {key:'empty', label:'is empty'},
		  {key:'notempty', label:'is not empty'},
		],
	};
	$scope.filterInputs = {
        boolean:{inputType:'hidden'},
        date:{inputType:'text'},
        number:{inputType:'text'},
        string:{inputType:'text'},
        agg:{inputType:'text'},
        
	};
	
    $scope.setColumnType = function(filter) {
    	for(i = 0; i < $scope.columns.length; i++) {
    		if($scope.columns[i].key == filter.field) {
    			filter.columnType = $scope.columns[i].type;
				if(-1 != filter.columnType.indexOf('agg')) {
					filter.sum = true;
				}
    		} 
    	}
    }
    
    $scope.initVal = function(filter) {
    	if(filter.columnType == 'boolean') {
    		filter.value = '1';
    	}
    }

    $scope.getColumnData = function(item, column) {
    	filt = column.ngFilter ? column.ngFilter : '';
    	val = item[column.displayOn] ? item[column.displayOn] : item[column.key] ? item[column.key] : '';
    	if(column.ngFilter != undefined) {
    		var passItem = column.ngFilter.passItem;
    		var passArg = column.ngFilter.arg == undefined ? false : true;
    		var passRef = column.ngFilter.ref == undefined ? false : true;
    		if(passItem && passArg && passRef) {
    			return $filter(column.ngFilter.name)(val, item, item[column.ngFilter.ref], column.ngFilter.arg);
    		}
    		else if(passItem && passArg) {
    			return $filter(column.ngFilter.name)(val, item, column.ngFilter.arg);
    		}
    		else if(passItem && passRef) {
    			return $filter(column.ngFilter.name)(val, item, item[column.ngFilter.ref]);
    		}
    		else if(passItem) {
    			return $filter(column.ngFilter.name)(val, item);
    		}
    		else if(passArg && passRef) {
    			return $filter(column.ngFilter.name)(val, item[column.ngFilter.ref], column.ngFilter.arg);
    		}
    		else if(passArg) {
    			return $filter(column.ngFilter.name)(val, column.ngFilter.arg);
    		}
    		else if(passRef) {
    			return $filter(column.ngFilter.name)(val, item[column.ngFilter.ref]);
    		}
    		else {
    			return $filter(column.ngFilter.name)(val);
    		}
    	}
    	else {
    		return val;
    	}
    };
  }
]);

pfControllers.controller('listCheckboxCtrl', ['$scope', '$controller', 'ApiModel',
  function($scope, $controller, ApiModel) {
	angular.extend(this, $controller('listCtrl', {$scope: $scope}));
	$scope.hasCheckboxes = true;
	$scope.allChecked = false;

	$scope.helpers = {
      list: {
    	lists:[],
      },
	};
	
	$scope.checkAll = function() {
		$scope.allChecked = !$scope.allChecked;
		for(var i = 0; i < $scope.items.length; i++) {
			var checked = $scope.allChecked;
			$scope.items[i].checked = checked;
		}
		$scope.countChecked = $scope.items.length;
		$scope.helpers.list.countChecked = $scope.items.length;
	}
		
	$scope.updateChecked = function() {
		count = 0;
		$scope.allChecked = false;
		for(var i = 0; i < $scope.items.length; i++) {
			if($scope.items[i].checked) {
				count++;
			}
		}
		$scope.countChecked = count;
		$scope.helpers.list.countChecked = count;
	}
	   
	
  }
]);

pfControllers.controller('bookListCtrl', ['$scope', '$controller', 'ApiModel',
  function($scope, $controller, ApiModel) {
	angular.extend(this, $controller('listCtrl', {$scope: $scope}));
    $scope.model = 'Book';
    $scope.title = 'Books';
    $scope.formTemplates =['book'];
    $scope.$parent.activeTab = 'books';
    $scope.$parent.title = 'Books | Plainframe';
    
    $scope.init = function() {
    	$scope.controllername = 'bookList';
    	$scope.defaultOrderBy = 'title';
    	$scope.defaultSort = 'asc';
    	$scope.filters = [];
    	$scope.initSettings();
    	
    	$scope.columns = [
          {key:'id', label:'ID', type: 'number', canFilter:true, canSort:true, hidden:true},
          {key:'title', label:'Title', type:'string', canFilter:true, canSort:true, hidden:false, ngFilter:{name:'detailLink', passItem:true, arg:'books/:id'}},
		  {key:'author', label:'Author', type:'string', canFilter:true, canSort:true, hidden:false},
		  {key:'pages', label:'Pages', type:'number', sum:true, canFilter:true, canSort:true, hidden:false},
		  {key:'allpages', label:'Page sum', type:'aggNumber', canFilter:true, canSort:true, hidden:false},
		  {key:'published', label:'Publish date', type:'date', canFilter:true, canSort:true, hidden:false, ngFilter:{name:'date', arg:'MM/dd/yyyy' }},
		];
    };
        
    $scope.init();
}]);	
	
pfControllers.controller('uploadListCtrl', ['$scope', '$controller', 'ApiModel',
  function($scope, $controller, ApiModel) {
	angular.extend(this, $controller('listCtrl', {$scope: $scope}));
    $scope.model = 'Upload';
    $scope.title = 'Uploads';
    $scope.formTemplates =['upload-file'];
    $scope.$parent.activeTab = 'uploads';
    $scope.$parent.title = 'Uploads | Plainframe';
    
    $scope.init = function() {
    	$scope.controllername = 'bookList';
    	$scope.defaultOrderBy = 'title';
    	$scope.defaultSort = 'asc';
    	$scope.filters = [];
    	$scope.initSettings();
    	
    	$scope.columns = [
          {key:'id', label:'ID', type: 'number', canFilter:true, canSort:true, hidden:true},
		  {key:'creatorid', label:'User', type: 'string', canFilter:true, canSort:true, hidden:true},
          {key:'title', label:'File name', type:'string', canFilter:true, canSort:true, hidden:false, ngFilter:{name:'detailLink', passItem:true, arg:'uploads/:id'}},
		  {key:'updated', label:'Updated', type:'date', canFilter:true, canSort:true, hidden:false, ngFilter:{name:'date', arg:'MM/dd/yyyy' }},
		];
    };
    
    $scope.init();
}]);