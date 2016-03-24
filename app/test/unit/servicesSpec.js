describe('Services: ApiModel', function() {
	
	var ApiModel, $httpBackend;
		
	beforeEach(module('pf'));
		
	beforeEach(inject(function(_$httpBackend_, _ApiModel_) {
		$httpBackend = _$httpBackend_;
		ApiModel = _ApiModel_;
	}));
	
	it('should return data for a collection', function() {
		var url = '/api/Books';
		var books = [
		  {id:1, title:'The Sound and the Fury', author:'William Faulkner'},
		  {id:2, title:'Atlas Shrugged', author:'Ayn Rand'},
		  {id:3, title:'The Brothers Karamazov', author:'Fyodor Dostoevsky'},
		];
		$httpBackend.whenGET(url).respond(books);
		ApiModel.collection({resource:'Books'}, function(result) {
			expect(result.length).toEqual(3);
		});
		$httpBackend.flush();
	});
	
	it('should return a single item', function() {
		var url = '/api/Books/1';
		var books = {id:1, title:'The Sound and the Fury', author:'William Faulkner'};
		$httpBackend.whenGET(url).respond(books);
		ApiModel.single({resource:'Books', id:1}, function(result) {
			expect(result.title).toEqual('The Sound and the Fury');
		});
		$httpBackend.flush();
	});
	

	it('should return a count for a collection', function() {
		var url = '/api/Books/count';
		var count = {count:3};
		$httpBackend.whenGET(url).respond(count);
		ApiModel.collectionCount({resource:'Books'}, function(result) {
			expect(result.count).toEqual(3);
		});
		$httpBackend.flush();
	});
});

describe('Services: Me', function() {
	
	var Me, $httpBackend;
		
	beforeEach(module('pf'));
		
	beforeEach(inject(function(_$httpBackend_, _Me_) {
		$httpBackend = _$httpBackend_;
		Me = _Me_;
	}));
	
	it('should return the current user object', function() {
		var url = '/api/me';
		var me = {userid:'jsbach', name:'Johann', role:'admin'};
		$httpBackend.whenGET(url).respond(me);
		Me.get({}, function(result) {
			expect(result.userid).toEqual('jsbach');
		});
		$httpBackend.flush();
	});
});

describe('Services: fileUpload', function() {
	
	var fileUpload, $httpBackend;
	
	beforeEach(module('pf'));
	
	beforeEach(inject(function(_$httpBackend_, _fileUpload_) {
		$httpBackend = _$httpBackend_;
		fileUpload = _fileUpload_;
	}));
	
	it('should send headers with Content-Type undefined', function() {
		var instantfile = {name: 'Fugue in D Minor.txt', data: 'Must love organ'};
		var fd = new FormData();
		fd.append('file', instantfile.data);
		var response = [{filename:instantfile.name}];
		$httpBackend.expectPOST('/upload', fd, function(headers) {
			return !headers['Content-Type'];
		}).respond(response);
		fileUpload.upload(fd);
		$httpBackend.flush();
	});
	
	it('should return an array of uploaded file names', function() {
		var instantfile = {name: 'Fugue in D Minor.txt', data: 'Must love organ'};
		var fd = new FormData();
		fd.append('file', instantfile.data);
		var response = [{filename:instantfile.name}];
		$httpBackend.expectPOST('/upload', fd).respond(response);
		var filenames = fileUpload.upload(fd);
		$httpBackend.flush();
		expect(filenames.length).toEqual(1);
		expect(filenames[0].filename).toEqual('Fugue in D Minor.txt');
	});
});