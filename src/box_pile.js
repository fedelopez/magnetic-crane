import Box from './box.js';

export default function BoxPile(boxes, width, height) {
    this._boxes = boxes;
    this._width = width;
    this._height = height;
}

BoxPile.prototype.isBoxAbove = function (box) {
    return this._boxes.some(function (candidateBox) {
        return box.y < candidateBox.y && box.x === candidateBox.x
    });
};

BoxPile.prototype.topmostBoxAbove = function (srcBox) {
    var topMostBox = undefined;

    this._boxes.filter(function (box) {
        return box != srcBox && box.x === srcBox.x && box.y > srcBox.y;
    }).forEach(function (box) {
        if (topMostBox === undefined || box.y > topMostBox.y) topMostBox = box;
    });
    return topMostBox;
};

BoxPile.prototype.firstFreeCoordinate = function (box, excludedAbscissa) {
    var abscissas = this._boxes.map(function (b) {
        return b.x;
    });
    abscissas.sort();
    for (var x = 0; x < this.getWidth(); x++) {
        if (x !== excludedAbscissa && abscissas.indexOf(x) < 0 && !this.intersectsBoxAt(x, 0)) {
            return {"x": x, "y": 0};
        }
    }
    var self = this;
    var result = this._boxes.filter(function (currentBox) {
        return (!self.isBoxAbove(currentBox) && currentBox.x != box.x && currentBox.x != excludedAbscissa && currentBox.y < self.getHeight() - 1);
    }).sort(function (a, b) {
        return a.x - b.x;
    });
    if (result.length > 0) {
        return {"x": result[0].x, "y": result[0].y + 1};
    }
    return undefined;
};

BoxPile.prototype.getBoxes = function () {
    return this._boxes.slice();
};

BoxPile.prototype.getWidth = function () {
    return this._width;
};

BoxPile.prototype.getHeight = function () {
    return this._height;
};

BoxPile.prototype.boxAt = function (x, y) {
    var boxes = this._boxes.filter(function (box) {
        return (box.x === x && box.y === y);
    });
    if (boxes.length > 0) return boxes[0];
    else return undefined;
};

BoxPile.prototype.intersectsBoxAt = function (x, y) {
    var boxes = this._boxes.filter(function (box) {
        console.log(JSON.stringify(box));
        return (box.x <= x && (box.x + box.width) > x) && (box.y <= y && (box.y + box.height > y));
    });
    return boxes.length > 0;
};

BoxPile.prototype.getBoxByName = function (boxName) {
    var boxes = this._boxes.filter(function (box) {
        return (box.name === boxName);
    });
    if (boxes.length > 0) return boxes[0];
    else return undefined;
};

BoxPile.prototype.copy = function () {
    const boxes = this._boxes.map(function (box) {
        return new Box(box.name, box.color, box.x, box.y, box.height, box.width);
    });
    return new BoxPile(boxes, this.getWidth(), this.getHeight());
};

BoxPile.moveBox = function (initialState, srcBox, dstX, dstY) {
    var steps = [];
    var currentState = initialState;
    var keepGoing = true;
    while (keepGoing) {
        currentState = currentState.nextState(srcBox, dstX, dstY);
        if (!currentState) {
            throw "No solution";
        }
        var step = currentState.getStep();
        steps.push(step);
        if (step.getBox().name === srcBox.name && step.getDstX() === dstX && step.getDstY() === dstY) {
            keepGoing = false;
        }
    }
    return steps;
};

BoxPile.createTerrain = function (terrainW, terrainH) {
    var boxes = [
        new Box("B1", "#0000FF", 1, 1, 1, 1),
        new Box("G1", "#008000", 1, 0, 1, 1),
        new Box("R1", "#FF0000", 2, 0, 2, 1),
        new Box("O1", "orange", 3, 0, 1, 1),
        new Box("B2", "#0000FF", 4, 0, 2, 2),
        new Box("G2", "#008000", 6, 0, 1, 2),
        new Box("R2", "#FF0000", 8, 0, 1, 1),
        new Box("O2", "orange", 9, 0, 2, 1)
    ];
    return new BoxPile(boxes, terrainW, terrainH);
};