/**
 * Utility functions to make testing and test assertions easier
 */
 
/*.............. String utilities .............................*/

String.prototype.startsWith = function(str){
    return (this.indexOf(str) === 0);
}

String.prototype.endsWith = function(str) {
    return (this.indexOf(str, this.length - str.length) !== -1);
};

String.prototype.contains = function(str) { 
    return (this.indexOf(str) !== -1)
};

/*.............. Assertions ...................................*/

/**
 * Test dom equality
 * 
 * @param {Object} actual
 * @param {Object} expected
 * @param {Object} message
 * @param {Bool} silent If actual and expected results are printed
 * to the page, it may broke some other tests. For example, if the 
 * actual or expected contains @include and we're testing elsewhere
 * whether all @include statements are removed from captured site,
 * the test breaks.
 * 
 * Notice: This is kind of ugly solution, since the unit tests should 
 * be independent from other tests without these kind of haxes.
 */
function clonedDomEqual(actual, expected, message, silent) {
	
	// IE: Remove checkbox element's value=on attribute
	// IE returns <input value=on ... >
	actual = actual.replace(/<INPUT value=on/gi,'<INPUT');
	
	// IE: Line breaks are changed after cloning, so in order to compare,
	// remove line breaks. This javascript code removes all 3 types of 
	// line breaks (\r\n, \n, \r)
	actual = actual.replace(/(\r\n|\n|\r)/gm,'');
	expected = expected.replace(/(\r\n|\n|\r)/gm,'');
	
	// IE: Remove empty "title" element. Seems that IE doesn't capture that.
	actual = actual.replace(/<title><\/title>/i, '');
	expected = expected.replace(/<title><\/title>/i, '');
	
	// All browers: Remove script element since they are not captured
	actual = actual.replace(/<script[^>]*?>[\s\S]*?<\/script>/gi, '');
	expected = expected.replace(/<script[^>]*?>[\s\S]*?<\/script>/gi, '');
	
	if (silent) {
		ok(actual === expected, message)
	}
	else {
		equals(actual, expected, message);
	}
}
