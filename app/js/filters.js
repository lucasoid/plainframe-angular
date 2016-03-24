angular.module('pfFilters', []).
filter('detailLink', ['$sce', function($sce) {
	return function(input, item, pattern) {
		input = input == undefined || input.trim() == '' ? '&lt;&gt;' : input;
		return -1 != pattern.indexOf(':id') && angular.isDefined(item.id) ? $sce.trustAsHtml('<a href="#/' + pattern.replace(':id', item.id) + '">' + input  + '</a>') : input;
	};
}]).
filter('highlight', ['$sce', function($sce) {
	return function(input, search) {
		
		var leading, highlighted, trailing, ind, length;
		length = 100;
		ind = input.toLowerCase().indexOf(search.toLowerCase());
		
		var start = (ind - (length/2)) > 0 ? ind - (length/2) : 0;
		var end = ind;
		var ellipsis = start > 0 ? '...' : ''; 
		leading = ellipsis + input.slice(start, end);
		
		var start = ind + search.length;
		var end = start + (length/2) - search.length;
		var ellipsis = end < input.length ? '...' : '';
		trailing = input.slice(start, end) + ellipsis;
		
		highlighted = '<span class="highlight">' + input.slice(ind, ind + search.length) + '</span>';
		return $sce.trustAsHtml(leading + highlighted + trailing);
	};
}]).
filter('truncateToPlainText', ['$sce', function($sce) {
	return function(input, length, offset) {
		var plain = angular.element('<div>' + input + '</div>').text();
		var ellipsis = '';
		if(offset == undefined) offset = 0;
		if(length == undefined) {
			end = plain.length;
		}
		else {
			end = offset + length;
		}
		if(length < plain.length) ellipsis = '...';
		return plain.substring(offset, end) + ellipsis;
	};
}]).
filter('booleanToSymbol', ['$sce', function($sce) {
	return function(input) {
		return input == 1 || input == '1' || input == true || input == 'true' ? $sce.trustAsHtml('<i class="fa fa-check"></i>') : '';
	}
}]);