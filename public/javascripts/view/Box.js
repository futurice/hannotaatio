/**
 * Box.
 *
 * @constructor
 *
 * @param {object} canvas Raphael canvas.
 * @param {object} colors Color theme.
 * @param {number} x x value.
 * @param {number} y y value.
 * @param {number} width Box width.
 * @param {number} height Box height.
 */
var Box = function(canvas, colors, x, y, width, height) {
    // Store color theme used in drawing
    this.colors = colors;

    // Define box attributes
    var boxColor = colors.boxColor;
    var boxOpacity = .9;
    var boxFillOpacity = .1;
    var boxRadius = 10;
    var boxStrokeWidth = 5;
    var pointRadius = 7;
    var pointStroke = colors.pointStroke;
    var pointFill = colors.pointFill;
    var pointOpacity = 0.7;

    var drawing = canvas.set();

    var rect = canvas.rect(
        x, y, width, height, boxRadius
    ).attr({
        'stroke': boxColor,
        'fill': boxColor,
        'opacity': boxOpacity,
        'fill-opacity': boxFillOpacity,
        'stroke-width': boxStrokeWidth
    });

    var nwPoint = canvas.circle(x, y, pointRadius).attr({
            'stroke': pointStroke,
            'fill': pointFill,
            'opacity': pointOpacity
        })
        .hide();
    var nePoint = canvas.circle(x + width, y, pointRadius).attr({
            'stroke': pointStroke,
            'fill': pointFill,
            'opacity': pointOpacity
        })
        .hide();
    var sePoint = canvas.circle(x + width, y + height, pointRadius).attr({
            'stroke': pointStroke,
            'fill': pointFill,
            'opacity': pointOpacity
        })
        .hide();
    var swPoint = canvas.circle(x, y + height, pointRadius).attr({
            'stroke': pointStroke,
            'fill': pointFill,
            'opacity': pointOpacity
        })
        .hide();

    // Combine box parts
    drawing.push(rect, nwPoint, nePoint, sePoint, swPoint);
    this.drawing = drawing;
};

/**
 * Returns box as a JSON representation.
 *
 * @return {object} JSON object.
 */
Box.prototype.generateJSON = function() {
    var json = {
        'type': 'rect',
        'colors': this.colors,
        'x': this.getRect().attr('x'),
        'y': this.getRect().attr('y'),
        'width': this.getRect().attr('width'),
        'height': this.getRect().attr('height')
    };
    return json;
};

/**
 * Returns Raphael set which includes the actual rectangle and resize handles.
 *
 * @return {object} Rectangle Raphael set.
 */
Box.prototype.getDrawing = function() {
    return this.drawing;
};

/**
 * Returns Raphael rectangle object.
 *
 * @return {object} Raphael rectangle object.
 */
Box.prototype.getRect = function() {
    return this.drawing[0];
};

/**
 * Returns NW resize handle as Raphael circle object.
 *
 * @return {object} NW resize handle as Raphael circle object.
 */
Box.prototype.getNwPoint = function() {
    return this.drawing[1];
};

/**
 * Returns NE resize handle as Raphael circle object.
 *
 * @return {object} NE resize handle as Raphael circle object.
 */
Box.prototype.getNePoint = function() {
    return this.drawing[2];
};

/**
 * Returns SE resize handle as Raphael circle object.
 *
 * @return {object} SE resize handle as Raphael circle object.
 */
Box.prototype.getSePoint = function() {
    return this.drawing[3];
};

/**
 * Returns SW resize handle as Raphael circle object.
 *
 * @return {object} SW resize handle as Raphael circle object.
 */
Box.prototype.getSwPoint = function() {
    return this.drawing[4];
};

/**
 * Removes the box
 */
Box.prototype.remove = function() {
    this.drawing.remove();
};

/**
 * Updates the position of rectangle and resize handles
 */
Box.prototype.update = function(x1, y1, x2, y2) {
    var x = Math.min(x1, x2);
    var y = Math.min(y1, y2);
    var width = Math.abs(x1 - x2);
    var height = Math.abs(y1 - y2);

    this.getRect().attr({'x': x, 'y': y, 'width': width, 'height': height});
    this.getNwPoint().attr({'cx': x, 'cy': y});
    this.getNePoint().attr({'cx': x + width, 'cy': y});
    this.getSePoint().attr({'cx': x + width, 'cy': y + height});
    this.getSwPoint().attr({'cx': x, 'cy': y + height});
};

/**
 * Check if box is too small.
 *
 * @return {boolean} true if box is too small to be drawn on the canvas.
 */
Box.prototype.tooSmall = function() {
    if (this.getRect().attr('width') < 8 && this.getRect().attr('width') < 8) {
        return true;
    } else {
        return false;
    }
};

// (function(){ /* test coverage for JSCoverage */ })();
