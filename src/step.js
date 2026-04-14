export default function Step(box, dstX, dstY) {
    this._box = box;
    this._dstX = dstX;
    this._dstY = dstY;
}

Step.prototype.getBox = function () {
    return this._box;
};

Step.prototype.getDstX = function () {
    return this._dstX;
};

Step.prototype.getDstY = function () {
    return this._dstY;
};