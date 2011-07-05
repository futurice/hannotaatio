$(document).ready(function(){

	module("Editor preferences", {
		setup: function() {
			// Setup		
		}, 
		teardown: function() {
			// Tear down
		}
	});
	
	test("Test default values", function() {
		var prefs = new EditPreferences();

		// Default values
		equals(prefs.apiDomain, document.domain);
		equals(prefs.apiPath, "/api/");
		equals(prefs.publishDomain, document.domain);
		equals(prefs.publishPath, "/view/");
		equals(prefs.protocol, window.location.protocol);
		equals(prefs.fileStorageDomain, "s3-eu-west-1.amazonaws.com");
		equals(prefs.fileStoragePath, "/futurice-hannotaatio-files/");
		
		
	});
		
	test("Test overrinding default values", function() {
		var prefs = new EditPreferences({
			apiDomain: "hannotaatio-api.info",
			apiPath: "/hannotaatio-api/",
			publishDomain: "hannotaatio-publish.info",
			publishPath: "/hannotaatio-publish/",
			fileStorageDomain: "hannotaatio-files.info",
			fileStoragePath: "/hannotaatio-files/",
			protocol: "ftp:",
		});

		// Assertion
		equals(prefs.apiUrl, "ftp://hannotaatio-api.info/hannotaatio-api/");
		equals(prefs.publishUrl, "ftp://hannotaatio-publish.info/hannotaatio-publish/");
		equals(prefs.fileStorageUrl, "ftp://hannotaatio-files.info/hannotaatio-files/");
    });
	
});