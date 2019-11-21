/*! From: http://stackoverflow.com/a/7180095 */
/// For moving the indexes of items in an array
Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

/* From: http://stackoverflow.com/a/24829409 */
/// Distance from top of window
function offsetFromWindow(element) {
    var xPosition = 0;
    var yPosition = 0;
    while (element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }

    return { x: xPosition, y: yPosition };
}