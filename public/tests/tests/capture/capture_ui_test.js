$(document).ready(function(){

	module("CaptureUI.js", {
		setup: function() {
		    var prefs = {
		        images_url: 'http://localhost:3000/images/capture/'
		    }
			ui = new CaptureUI(prefs);
		}, 
		teardown: function() {
			delete ui;
		}
	});
	
	test("createButton", 3, function() {
	    var clicked = false;
		ui.createButton("#qunit-fixture", function () {
		    clicked = true;
		});
		
		$button = $('#hannotaatio-capture', $('#qunit-fixture'));
		$button.trigger('click');
		
		equals($button.length, 1, 'should inject a button to document');
		equals($button.css('background-image').contains('http://localhost:3000/images/capture/captureButton_states.png'), true, 'should have background-image set');
		equals(clicked, true, "should handler clicks")
    });
});