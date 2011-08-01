$(document).ready(function(){

    module("Capturer.js");

    test("Constructor does not accept string", function() {
		raises(function() {
			    new Capturer('html');
		    }, "Must raise exception");
    });

    test("Constructor does not accept DOM element", function() {
		raises(function() {
			    new Capturer($('html').get(0));
		    }, "Must raise exception");
    });

	test("Input element can be converted back to string", function() {
        var $rootElement = $('<div><p>paragraph</p></div>');
        var capturer = new Capturer($rootElement);

        // ignore case (because of IE's outerHTML)
        equals(capturer.toString().toLowerCase(),
		      '<div><p>paragraph</p></div>', "toString failed");
    });

    test("Strip script tags removes deeper in element hierarchy", function() {
        var htmlString = '<div><p>test paragraph<script type="text/javascript">var x = 100;</script></p></div>';
        var expectedHtmlString = '<div><p>test paragraph</p></div>';

        var capturer = new Capturer($(htmlString));
        capturer.stripScriptTags();

        // ignore case (because of IE's outerHTML)
        equals(capturer.toString().toLowerCase().replace("\r\n", ""),
		    '<div><p>test paragraph</p></div>', "Strip script tags failed");
    });

    test("Strip script tags removes many script tags", function() {
        var htmlString = '<div><p>Test paragraph</p><script type="text/javascript">var x = 100;</script>' +
                         '<p>Another script<script src="test.js"></script></p></div>';

        var expectedHtmlString = '<div><p>Test paragraph</p><p>Another script</p></div>';

        var capturer = new Capturer($(htmlString));
        capturer.stripScriptTags();

        // ignore case (because of IE's outerHTML)
        equals(capturer.toString().toLowerCase().replace("\r\n", ""),
		    expectedHtmlString.toLowerCase(), "Strip script tags failed");
    });

    /**
     * Tests UUID (a.k.a GUID) generation.
     *
     * From Wikipedia:
     * Version 4 UUIDs have the form
     * xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx with any hexadecimal
     * digits for x but only one of 8, 9, A, or B for y.
     * e.g. f47ac10b-58cc-4372-a567-0e02b2c3d479.
     */
    test("UUID generation method generates valid UUIDs", function() {
        var capturer = new Capturer($('<div />'));

        // Test that the UUID is created in the constructor
        var uuid = capturer.uuid;

        // Test each character
        for(var j = 0; j < uuid.length; j++){
            var UUIDChar = uuid.charAt(j);

            // Test correct dash chars
            if(j === 8 || j === 13 || j === 18 || j === 23){
                equals(UUIDChar, '-', 'UUID char -: ' + UUIDChar + ', index: ' + j);
            }

            // Test x digit '4'
            else if(j === 14){
                equals(UUIDChar, '4', 'UUID char 4: ' + UUIDChar + ', index: ' + j);
            }

            // Test y char 8, 9, A, B
            else if(j === 19){
                var okCharsY = '89AB';
                var yCharOK = okCharsY.indexOf(UUIDChar) > -1;
                ok(yCharOK, 'UUID char Y: ' + UUIDChar + ', index: ' + j);
            }

            // Test x char (any hex char)
            else {
                var okCharsX = '0123456789ABCDEF';
                var xCharOk = okCharsX.indexOf(UUIDChar) > -1;
                ok(xCharOk, 'UUID char X: ' + UUIDChar + ' , index: ' + j);
            }
        }

    });

	test("Captured DOM contains the doctype", function() {
		var capturer = new Capturer($('html'));
		var doctype = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">';

		equals(capturer.getDoctype(), doctype, 'Captured doctype');
	});

	test("getUniqueImageURLs()", function() {
	    expect(4);
		var capturer = new Capturer($('html'));

        capturer.captureStylesheets();

		var imageURLs = capturer.getUniqueImageURLs();

		equals(imageURLs.length, 3, 'Length');
		equals(imageURLs[0].url, 'resources/red_dot.png', 'From image');
		equals(imageURLs[1].url, 'resources/flower.jpg', 'From image, not duplicated');
        ok(imageURLs[2].url.indexOf('resources/flower.jpg') != -1, 'CSS image');
	});
	
    test("updateImgTagUrls()", function() {
        expect(2);
        var capturer = new Capturer($('html'));
        
        var images = {
            'resources/red_dot.png': {
                'newUrl': 'resources_red_dot.png'
            },
            'resources/flower.jpg': {
                'newUrl': 'resources_flower.png'
            },
        }
        
        capturer.setCapturedImages(images);
        
        capturer.updateImgTagUrls();
        
        var $img = $('img', capturer.$elementToCapture);
        
        equals($img.eq(0).attr('src'), 'resources_red_dot.png', 'New url ok');
        equals($img.eq(1).attr('src'), 'resources_flower.png', 'New url ok'); 
    });
	
    test("updateStyleUrls()", function() {
        expect(2);
        var capturer = new Capturer($('html'));
        capturer.captureStylesheets();
		
		// Create stylesheet url
		var currentLocationParsed = (new URL()).parsedUrl;
		var cssFileLocation = currentLocationParsed.protocol + '://' + 
		      currentLocationParsed.authority + 
			  currentLocationParsed.directory + 
			  'resources/capture_css_test_image_url.css';
		var flowerUrl = new URL('flower.jpg', cssFileLocation);
		var absoluteFlowerUrl = new URL(flowerUrl.absoluteUrl);
		var newFlowerUrl = ImageCapturer.filenameFromPath(absoluteFlowerUrl);
		
        var images = {};
        images[flowerUrl.absoluteUrl] = {'newUrl': newFlowerUrl};
		
        capturer.setCapturedImages(images);
        
        capturer.updateStyleUrls();
        
		var styleContent = $('style', capturer.$elementToCapture).eq(0).html();
		var urlIndex = styleContent.indexOf(newFlowerUrl);
		
        var okValue = urlIndex != -1;
		
		ok(okValue, 'Index was ' + urlIndex);
		
		// Test Do NOT remove anything else
		var bgPosIndex = styleContent.indexOf("20px 100px");
		okValue = bgPosIndex != -1;
		
		ok(okValue, 'BG Index was ' + bgPosIndex);
    });
    
    asyncTest('captureImages', 4, function() {
        var capturer;
        
        capturer = new Capturer($('html'), {captureImages: true, flash_url: '/flash/capture/', crossDomainFileAvailable: true});
        capturer.captureImages(function(captured) {
            ok(true, 'should always call callback');
            equals(captured, true, 'should call callback with true (captureImages set true)');
            start();
        });
        
        capturer = new Capturer($('html'));
        capturer.captureImages(function(captured) {
            ok(true, 'should always call callback');
            equals(captured, false, 'should call callback with false (does not capture images by default)');
        });
    });
});







