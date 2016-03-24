describe('pfFilters.detailLink', function() {
	beforeEach(module('pf'));
	
	var $filter;
	var $sce;
	
	beforeEach(inject(function(_$sce_, _$filter_) {
		$sce = _$sce_;
		$filter = _$filter_;
	}));
	it('returns brackets when input is empty', function() {
		var detailLink = $filter('detailLink');
		var item = {id:24, name:''};
		var input = item.name;
		var pattern = 'test/:id';
		var result = detailLink(input, item, pattern);
		expect($sce.getTrustedHtml(result)).toEqual('<a href="#/test/24">&lt;&gt;</a>');
	});
	
	it('returns the original input when id is undefined', function() {
		var detailLink = $filter('detailLink');
		var item = {name:'Jane Smith'};
		var input = item.name;
		var pattern = 'test/:id';
		var result = detailLink(input, item, pattern);
		expect($sce.getTrustedHtml(result)).toEqual('Jane Smith');
	});
	
	it('returns the detail link when input and id are present', function() {
		var detailLink = $filter('detailLink');
		var item = {id:24, name:'Jane Smith'};
		var input = item.name;
		var pattern = 'test/:id';
		var result = detailLink(input, item, pattern);
		expect($sce.getTrustedHtml(result)).toEqual('<a href="#/test/24">Jane Smith</a>');
	});
});

describe('pfFilters.truncateToPlainText', function() {
	beforeEach(module('pf'));
	
	var $filter;
	
	beforeEach(inject(function(_$filter_) {
		$filter = _$filter_;
	}));
	it('returns a plain text substring from an HTML snippet', function() {
		var truncateToPlainText = $filter('truncateToPlainText');
		var input = '<h1>A Tale of Two Cities</h1>';
		var length = 100;
		var offset = 10;
		var result = truncateToPlainText(input, length, offset);
		expect(result).toEqual('Two Cities');
	});
	it('returns a plain text substring from an HTML snippet with an ellipsis', function() {
		var truncateToPlainText = $filter('truncateToPlainText');
		var input = '<h1>A Tale of Two Cities</h1><p>It was the <i>best of times, it was the worst of times.</i></p>';
		var length = 10;
		var offset = 10;
		var result = truncateToPlainText(input, length, offset);
		expect(result).toEqual('Two Cities...');
	});
	
});

describe('pfFilters.highlight', function() {
	beforeEach(module('pf'));
	
	var $filter, $sce;
	
	beforeEach(inject(function(_$filter_, _$sce_) {
		$filter = _$filter_;
		$sce = _$sce_;
	}));
	it('returns the input with a highlighted search term', function() {
		var highlight = $filter('highlight');
		var input = '<h1>A Tale of Two Cities</h1>';
		var search = 'Two';
		var result = $sce.getTrustedHtml(highlight(input, search));
		expect(result).toEqual('<h1>A Tale of <span class="highlight">Two</span> Cities</h1>');
	});
	
	it('centers the contextual snippet around the highlighted search term and adds ellipses', function() {
		var highlight = $filter('highlight');
		var input = 'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way – in short, the period was so far like the present period, that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only.';
		var search = 'wisdom';		
		var result = $sce.getTrustedHtml(highlight(input, search));
		expect(result).toEqual('...mes, it was the worst of times, it was the age of <span class="highlight">wisdom</span>, it was the age of foolishness, it was the ...');
	});	
});

describe('pfFilters.booleanToSymbol', function() {
	beforeEach(module('pf'));
	
	var $filter;
	var $sce;
	
	beforeEach(inject(function(_$sce_, _$filter_) {
		$sce = _$sce_;
		$filter = _$filter_;
	}));
	
	it('returns a font-awesome checkmark if value is truthy', function() {
		var input = true;
		expect($sce.getTrustedHtml($filter('booleanToSymbol')(input))).toEqual('<i class="fa fa-check"></i>');
		
		var input = 'true';
		expect($sce.getTrustedHtml($filter('booleanToSymbol')(input))).toEqual('<i class="fa fa-check"></i>');
		
		var input = '1';
		expect($sce.getTrustedHtml($filter('booleanToSymbol')(input))).toEqual('<i class="fa fa-check"></i>');
		
		var input = 1;
		expect($sce.getTrustedHtml($filter('booleanToSymbol')(input))).toEqual('<i class="fa fa-check"></i>');
	});
	
	it('returns an empty string if value is falsy', function() {
		var input = false;
		expect($sce.getTrustedHtml($filter('booleanToSymbol')(input))).toEqual('');
		
		var input = 'false';
		expect($sce.getTrustedHtml($filter('booleanToSymbol')(input))).toEqual('');
		
		var input = 0;
		expect($sce.getTrustedHtml($filter('booleanToSymbol')(input))).toEqual('');
		
		var input = {someVal:'x'};
		expect($sce.getTrustedHtml($filter('booleanToSymbol')(input))).toEqual('');
	});
});