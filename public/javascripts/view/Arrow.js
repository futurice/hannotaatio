/**
 * Arrow.
 *
 * @constructor
 *
 * @param {object} canvas Raphael canvas.
 * @param {object} colors Color theme.
 * @param {number} tailX x value of the arrow tail.
 * @param {number} tailY y value of the arrow tail.
 * @param {number} headX x value of the arrow head.
 * @param {number} headY y value of the arrow head.
 */
var Arrow = function(canvas, colors, tailX, tailY, headX, headY) {
    // Store color theme used in drawing
    this.colors = colors;

    // Define arrow attributes
    this.arrowColor = colors.arrowColor;
    this.arrowOpacity = 0.9;
    this.arrowStrokeWidth = 7;
    this.arrowHeadHeight = 15;
    this.arrowHeadWidth = 20;
    this.pointRadius = 7;
    this.pointStroke = colors.pointStroke;
    this.pointFill = colors.pointFill;
    this.pointOpacity = 0.7;

    this.tailX = tailX;
    this.tailY = tailY;
    this.headX = headX;
    this.headY = headY;

    var drawing = canvas.set();

    var head = canvas.path().attr({
        'stroke': this.arrowColor,
        'fill': this.arrowColor,
        'opacity': this.arrowOpacity
    });
    var headPoint = canvas.circle(headX, headY, this.pointRadius).attr({
        'stroke': this.pointStroke,
        'fill': this.pointFill,
        'opacity': this.pointOpacity
    })
    .hide();
    var tail = canvas.path().attr({
        'stroke': this.arrowColor,
        'stroke-width': this.arrowStrokeWidth,
        'opacity': this.arrowOpacity
    });
    var tailPoint = canvas.circle(tailX, tailY, this.pointRadius).attr({
        'stroke': this.pointStroke,
        'fill': this.pointFill,
        'opacity': this.pointOpacity
    })
    .hide();

    // Combine arrow parts
    drawing.push(head, headPoint, tail, tailPoint);
    this.drawing = drawing;

    // Update paths and rotation
    this.update(tailX, tailY, headX, headY);
};

/**
 * Returns box as a JSON representation.
 *
 * @return {object} JSON object.
 */
Arrow.prototype.generateJSON = function() {
    var json = {
        'type': 'arrow',
        'colors': this.colors,
        'headX': this.headX,
        'headY': this.headY,
        'tailX': this.tailX,
        'tailY': this.tailY
    };
    return json;
};

/**
 * Returns Raphael set which includes the actual arrow and resize handles.
 *
 * @return {object} Rectangle Raphael set.
 */
Arrow.prototype.getDrawing = function() {
    return this.drawing;
};

Arrow.prototype.getHead = function() {
    return this.drawing[0];
};

Arrow.prototype.getHeadPoint = function() {
    return this.drawing[1];
};

Arrow.prototype.getTail = function() {
    return this.drawing[2];
};

Arrow.prototype.getTailPoint = function() {
    return this.drawing[3];
};

/**
 * Removes the arrow
 */
Arrow.prototype.remove = function() {
    this.drawing.remove();
};

Arrow.prototype.update = function(x1, y1, x2, y2) {
    // Update stored end points
    this.tailX = x1;
    this.tailY = y1;
    this.headX = x2;
    this.headY = y2;

    var angle = Math.atan2(y2 - y1, x2 - x1);
    var ca = Math.cos(angle);
    var sa = Math.sin(angle);

    // Update paths
    this.drawing[0].attr({
        path: 'M' + x2 + ',' + y2 + ' L' + (x2 + this.arrowHeadWidth / 2) +
                ',' + (y2 - this.arrowHeadHeight) +
                ' L' + (x2 - this.arrowHeadWidth / 2) +
                ',' + (y2 - this.arrowHeadHeight) +
                'z'
    });
    this.drawing[1].attr({cx: x2, cy: y2});
    this.drawing[2].attr({
        path: 'M' + x1 + ',' + y1 +
                ' L' + (x2 - ca * this.arrowHeadHeight) +
                ',' + (y2 - sa * this.arrowHeadHeight) +
                ' L' + (x2 - ca * this.arrowHeadHeight) +
                ',' + (y2 - sa * this.arrowHeadHeight) +
                ' z'
    });

    this.drawing[3].attr({cx: x1, cy: y1});

    // Update rotation
    this.drawing[0].attr(
        {rotation: '' + Raphael.deg(angle) - 90 + ', ' + x2 + ', ' + y2}
    );
};

Arrow.prototype.tooShort = function() {
    if (this.drawing[2] &&
            this.drawing[2].getTotalLength() < 1.5 * this.arrowHeadHeight) {
        return true;
    } else {
        return false;
    }
};

// (function(){ /* test coverage for JSCoverage */ })();
