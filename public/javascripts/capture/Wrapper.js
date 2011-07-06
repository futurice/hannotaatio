/*

 Copyright (c) 2011 Futurice Ltd, http://www.futurice.com
 
 Permission is hereby granted, free of charge, to any person obtaining a 
 copy of this software and associated documentation files (the "Software"), 
 to deal in the Software without restriction, including without limitation 
 the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 and/or sell copies of the Software, and to permit persons to whom the 
 Software is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included 
 in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
 THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 DEALINGS IN THE SOFTWARE.
 
*/

/*

 Hannotaatio Capture Tool @VERSION_INFO@

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