$(document).ready(function(){

	module("Edit tool Utils.js", {
		setup: function() {
			// Setup		
		}, 
		teardown: function() {
			// Tear down
		}
	});
	
	test("Extracts the UUID from the URL", function() {
		var utils = new Utils();
		var url = "http://hannotaatio.futurice.com/view/1234567889994654343212514326316431542132";
		var uuid = utils.getUUIDFromUrl(url);

		// Assertion
		equals(uuid, "1234567889994654343212514326316431542132", "The UUID matches");
    });
	
	test("Extracts the UUID from URL query", function() {
		var utils = new Utils();
		var url = "http://hannotaatio.futurice.com/view/blaahblaah/anything.html?something=novalue&uuid=1234567889994654343212514326316431542132";
		var uuid = utils.getUUIDFromUrl(url);

		// Assertion
		equals(uuid, "1234567889994654343212514326316431542132", "The UUID matches");
		
		url = "http://hannotaatio.futurice.com/?uuid=1234567889994654343212514326316431542132";
		uuid = utils.getUUIDFromUrl(url);

		// Assertion
		equals(uuid, "1234567889994654343212514326316431542132", "The UUID matches");
	});
});