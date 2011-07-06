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
		ui.createButton('#qunit-fixture', function () {
		    clicked = true;
		});
		
		$button = $('#hannotaatio-capture', $('#qunit-fixture'));
		$button.trigger('click');
		
		equals($button.length, 1, 'should inject a button to document');
		equals($button.css('background-image').contains('http://localhost:3000/images/capture/captureButton_states.png'), true, 'should have background-image set');
		equals(clicked, true, "should handler clicks")
    });
    
    test("createDialog", function() {
        ui.createDialog('#qunit-fixture');
        $dialog = $('#hannotaatio-status', $('#qunit-fixture'));
        
        equals($dialog.length, 1, 'should inject a dialog to document');
        equals($dialog.css('z-index'), "1000001", 'should have a high enough z-index');
        equals($dialog.css('background-image').contains('http://localhost:3000/images/capture/dialogbg.png'), true, 'should have a gradient background');
        equals($dialog.is(':visible'), false, 'should be hidden');
    });
    
    test("showStatus", function() {
        ui.createDialog('#qunit-fixture');
        ui.showStatus("Dialog message changed", "LOADER");
        $dialog = $('#hannotaatio-status', $('#qunit-fixture'));
        
        equals($('#hannotaatio-status-message', $dialog).html(), 'Dialog message changed', 'should change the message');
        equals($('#hannotaatio-status-image').attr('src'), 'http://localhost:3000/images/capture/loader.gif', 'should change the icon');
        equals($dialog.is(':visible'), true, 'should be visible');
    })
});