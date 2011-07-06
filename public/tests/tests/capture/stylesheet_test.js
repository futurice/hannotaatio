$(document).ready(function(){

	module("Stylesheet", {
		setup: function() {

			// These functions will be mocked
			this.originalCaptureStylesheet
					= Capturer.prototype.captureStylesheet;

			this.originalCaptureOtherDomainStylesheet
					= Capturer.prototype.captureOtherDomainStylesheet;

			// Remove whitespaces
			w = function(str) {
				return str.replace(/\s+/g, '').toLowerCase();
			}
		},
		teardown: function() {

			// These functions were mocked
			Capturer.prototype.captureStylesheet =
					this.originalCaptureStylesheet;

			Capturer.prototype.captureOtherDomainStylesheet =
					this.originalCaptureOtherDomainStylesheet;

			$('.hannotaatio_embeded_stylesheet').remove();

			delete this.capturer;
		}
	});

	test("Detects relative stylesheet paths as local domain urls", function() {
		var local = 0;
		var other = 0;
		Capturer.prototype.captureStylesheet = function() {
			// ok(true, "OK");
			local++;
		}
		Capturer.prototype.captureOtherDomainStylesheet = function() {
			// ok(false, "Detected local domain as other domain");
			other++;
		}

		var capturer = new Capturer($('html'));
		capturer.captureStylesheets();

		equals(local, 10, 'Detected local stylesheets');
		equals(other, 0, 'Detected other than local stylesheets');
	});
	
	test("captureStylesheet", 4, function() {
	    var called1 = false;
	    var called2 = false;
	    var calledWithTrue = false;
	    var calledWithFalse = false;
	    
	    stop();
	    stop();
	    
	    var capturer = new Capturer($('html'), {captureStylesheets: false});
	    capturer.captureStylesheets(function(captured) {
	        called1 = true;
	        calledWithFalse = captured === false;
	        start();
	    });
	    var capturer = new Capturer($('html'));
	    capturer.captureStylesheets(function(captured) {
            called2 = true;
	        calledWithTrue = captured === true;
	        start();
	    });
	    
	    equals(called1, true, 'should always call the callback');
	    equals(called2, true, 'should always call the callback');
	    equals(calledWithFalse, true, 'should return false if stylesheets were not captured');
	    equals(calledWithTrue, true, 'should capture by default and should return true');
	});

	test("Removes link elements with url pointing to local domain", function() {

		var capturer = new Capturer($('html'));

		capturer.captureStylesheets();
		var linkLength = $('link[rel=stylesheet]', capturer.$elementToCapture).length;

		equals(linkLength, 2, 'Removed local link tags correctly');
	});

	test("replaceStylesheet: Inserts new stylesheet to $elementToCapture", function() {
		var capturer = new Capturer($('html'));

		var styleSheet = document.styleSheets[0];

		capturer.replaceStylesheet(styleSheet, $('<style id="hannotaatio_newly_added_style_tag" type="text/css">.nothing {}</style>'), 0);

		var $newStyleTag = $('style', capturer.$elementToCapture);
		equals($newStyleTag.length, 5, "Found newly added style");
	});

	test("replaceStylesheet: Inserts new stylesheet to exactly correct place", function() {
		var capturer = new Capturer($('html'));

		var index = 5;
		var styleSheet = document.styleSheets[index];

		capturer.replaceStylesheet(styleSheet, $('<style id="hannotaatio_newly_added_style_tag" type="text/css">.newlyAddedStyle {}</style>'), index);

		equals($('#styletagBefore', capturer.$elementToCapture).next().attr('id'), 'hannotaatio_newly_added_style_tag', "Place ok");
		equals($('#styletagAfter', capturer.$elementToCapture).prev().attr('id'), 'hannotaatio_newly_added_style_tag', "Place ok");
	});

	test("replaceStylesheet: Removes old stylesheet from $elementToCapture", function() {
		var capturer = new Capturer($('html'));

		var index = 5;
		var styleSheet = document.styleSheets[index];

		capturer.replaceStylesheet(styleSheet, $('<style id="hannotaatio_newly_added_style_tag" type="text/css">.newlyAddedStyle {}</style>'), index);

		equals($('link', capturer.$elementToCapture).length, 6, 'Remove ok');
	});

	test("replaceStylesheet: Does not remove old stylesheet from original DOM", function() {
		var capturer = new Capturer($('html'));

		var index = 4;
		var styleSheet = document.styleSheets[index];

		capturer.replaceStylesheet(styleSheet, $('<style id="hannotaatio_newly_added_style_tag" type="text/css">.newlyAddedStyle {}</style>'), index);

		equals($('link').length, 7, 'Did not remove ok');
	});

	test("The content of newly added style element is the same as the stylesheet content", function() {
		var capturer = new Capturer($('html'));

		capturer.captureStylesheets();

		var $styleTag = $('.hannotaatio_embeded_id_5', capturer.$elementToCapture);

		var expected = w('#hannotaatio_css_non_existing_test_div_id { font-weight: bold; }');
		var actual = w($styleTag.html());
		
		// IE removes the last semi-colon (;), other browsers don't.
		// So, remove the semi-colon so that this can be tested
		actual = actual.replace(';}', '}');
		expected = expected.replace(';}', '}');
		
		equal(actual, expected, 'The newly added style tag content is the same as the stylesheet content');
	});

	test("Stylesheet capturing doesn't duplicate style rules if they are in style tag", function() {
	    var capturer = new Capturer($('html'));
	    capturer.captureStylesheets();

	    var domString = capturer.toString();
		var searchResult = domString.match('.unique_hannotaatio_css_rule');

		var uniqueClassCount = searchResult != null ? searchResult.length : 0;

	    equals(uniqueClassCount, 1, "Must not duplicate styles");
	});

	test("Captures @imported stylesheet that we're imported inside embedded stylesheet", function() {
		var capturer = new Capturer($('html'));

	    var stylesheetsLenghtAfterLoad = 2;

		capturer.captureStylesheets();

		var $styleTag = $('.hannotaatio_embeded_id_3', capturer.$elementToCapture);

		var expectedContent1 = w('#hannotaatio_css_imported_rule { font-weight: bold }');
		var expectedContent2 = w('#hannotaatio_css_imported_rule { font-weight: bold; }');
		var content = w($styleTag.html());

		ok((content === expectedContent1 || content === expectedContent2), 'The newly added style tag content is the same as the stylesheet content');
	});

	test("Captures recursive @imported stylesheet that we're imported inside embedded stylesheet", function() {

		var capturer = new Capturer($('html'));

		capturer.captureStylesheets();

		var $styleTag = $('.hannotaatio_embeded_id_2', capturer.$elementToCapture);

		var expectedContent1 = w('#hannotaatio_recursively_imported_rule { font-weight: bold }');
		var expectedContent2 = w('#hannotaatio_recursively_imported_rule { font-weight: bold; }');
		var content = w($styleTag.html());

		ok((content === expectedContent1 || content === expectedContent2), 'The newly added style tag content is the same as the stylesheet content');
	});

	test("Captures @imported stylesheet from style tags", function() {
        var capturer = new Capturer($('html'));

		capturer.captureStylesheets();

		var $styleTag = $('.hannotaatio_embeded_id_7', capturer.$elementToCapture);

		var expectedContent1 = w('#hannotaatio_imported_from_style_tag { font-weight: bold }');
		var expectedContent2 = w('#hannotaatio_imported_from_style_tag { font-weight: bold; }');
		var content = w($styleTag.html());

		ok((content === expectedContent1 || content === expectedContent2), 'The newly added style tag content is the same as the stylesheet content');
	});

	test("All @import statements are removed", function() {
        var capturer = new Capturer($('html'));

		capturer.captureStylesheets();
		
		equals(capturer.getHtmlContent().indexOf('@import url('), -1, '@import statements are removed');
	});

	test("No 'initial' values", function() {
		var capturer = new Capturer($('html'));

		capturer.captureStylesheets();

		var foundInitial = false;
		$('style', capturer.$elementToCapture).each(function() {
			var rules = $(this).html().split(';');

			for (var i = 0; i < rules.length; i++){
				var rule = rules[i];

				if(rule.indexOf(':') === -1){
					// No value
					continue;
				}

				var valuePart = rule.split(':')[1];


				if(valuePart.indexOf('initial') !== -1){
					foundInitial = true;
					return;
				}
			}
		});

		ok(!foundInitial, 'No initial value found');
	});

	test("hasCapturableMediaType()", function() {
		var capturer = new Capturer($('html'));

		var screenStylesheetIndex = 1;
		var screenStylesheet = document.styleSheets[screenStylesheetIndex];

		equals(capturer.hasCapturableMediaType(screenStylesheet), true, 'Screen media type');

		var printStylesheetIndex = 2;
		var printStylesheet = document.styleSheets[printStylesheetIndex];

		equals(capturer.hasCapturableMediaType(printStylesheet), false, 'Print media type');

		var noMediaStylesheetIndex = 3;
		var noMediaStylesheet = document.styleSheets[noMediaStylesheetIndex];

		equals(capturer.hasCapturableMediaType(noMediaStylesheet), true, 'No media type');

	});
	
	test("Capturing doesn't have any effect on the original site", function() {
		var expected = $('html').html();
		var capturer = new Capturer($('html'));
		capturer.captureStylesheets();
		var actual = $('html').html();
		
		equal(actual, expected);
		
	});
});





