$(document).ready(function(){

	module('URL.js', {
		setup: function() {
			// Setup		
		}, 
		teardown: function() {
			// Tear down
		}
	});
	
	test('URL()', 5, function() {
		
		var givenUrl = new URL('http://testsite.com/path/file.html');
		equals(givenUrl.url, 'http://testsite.com/path/file.html', 'Given url');
		
		var noGivenUrl = new URL();
		equals(noGivenUrl.url, window.location.href, 'No given url');
		
		raises(function() {
			new URL('http://testsite.com/', '../can_not_be_relative/file.html');
		}, "Location can not be relative");
		
		var location = 'http://testsite.com/path/';
		var urlWithLocation = new URL('file.html', location);
		equals(urlWithLocation.location, 'http://testsite.com/path/', 'URL with location');

		var urlWithoutLocation = new URL('file.html');
		equals(urlWithoutLocation.location, window.location.href, 'URL without location');
	});
	
	test('isRelative', 2, function() {
		
		equals(URL.isRelative('http://testsite.com'), false, 'Absolute url');
		equals(URL.isRelative('/assets/images/image.png'), true, 'Relative url');
	});
	
	test('absoluteUrl()', 4, function() {
		
		var location = 'http://testsite.com/path/index.html';

		equals(URL.absoluteUrl('https://testsite.com:8080/testpath/testfile.html', location), 'https://testsite.com:8080/testpath/testfile.html', 'Absolute');
		equals(URL.absoluteUrl('file.html', location), 'http://testsite.com/path/file.html', 'Relative');
		equals(URL.absoluteUrl('/file.html', location), 'http://testsite.com/file.html', 'Relative with slash');
		
		var okValues = URL.absoluteUrl('../file.html', location) == 'http://testsite.com/file.html' || 
							URL.absoluteUrl('../file.html', location) == 'http://testsite.com/path/../file.html';
	 	ok(okValues, 'Relative with dots');
    });

	test('isSameDomain()', 6, function() {
		
		var location = 'http://testsite.com/path/';
		
		equals(URL.isSameDomain('assets/images/image.png', location), true, 'Relative');
		equals(URL.isSameDomain('http://testsite.com/assets/image.png', location), true, 'Same domain');
		equals(URL.isSameDomain('http://anothertestsite.com/assets/image.png', location), false, 'Different host');
		equals(URL.isSameDomain('https://testsite.com/assets/image.png', location), false, 'Different protocol');
		equals(URL.isSameDomain('http://testsite.com:8080/assets/image.png', location), false, 'Different port');
		equals(URL.isSameDomain('http://testsite.com:80/assets/image.png', location), true, 'Port 80');
	})
	
});