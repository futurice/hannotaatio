/** 
 * @preserve
 * 
 * Hannotaatio Capture Tool @VERSION_INFO@
 * 
 */

/**
 * This immediate function is used to provide a 'scope sandbox' for our code.
 * This is done so that our code doesn't accidentaly override variables
 * or functions defined on the web site to be annotated.
 *
 * Loads required jQuery version
 *
 * More info:
 * http://stackoverflow.com/questions/2170439/
 *  how-to-embed-javascript-widget-that-depends-on-jquery-into-an-unknown-environment
 */
(function(window, document, version, callback) {
    var j, d;
    var loaded = false;
    if (!(j = window.jQuery) || version > j.fn.jquery || callback(j, loaded)) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/' +
                '1.6.1/jquery.min.js';
        script.onload = script.onreadystatechange = function() {
            if (!loaded && (!(d = this.readyState) || d == 'loaded' ||
                    d == 'complete')) {
                callback((j = window.jQuery).noConflict(1), loaded = true);
                j(script).remove();
            }
        };
        document.documentElement.childNodes[0].appendChild(script);
    }
})(window, document, '1.6.1', function($, jquery_loaded)
{
// @OUTPUT@
});