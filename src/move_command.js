const template = "Move [box1] [on top of / below] [box2]";

let srcBox = {box: undefined, text: "[box1]"},
    dstBox = {box: undefined, text: "[box2]"},
    where = "[on top of / below]";

let isBox1 = true;

export default function MoveCommand() {
}

MoveCommand.prototype.getText = function () {
    isBox1 = !isBox1;
    return template.replace("[box1]", srcBox.text).replace("[box2]", dstBox.text).replace("[on top of / below]", where);
};

MoveCommand.prototype.setBox = function (newBox) {
    if (isBox1) {
        srcBox = {box: newBox, text: newBox.name};
        dstBox = {box: undefined, text: "[box2]"};
    } else {
        dstBox = {box: newBox, text: newBox.name};
    }

};

MoveCommand.prototype.setWhere = function (newWhere) {
    if (isBox1) {
        where = "[on top of / below]";
    } else {
        where = newWhere;
    }
};

MoveCommand.prototype.canMove = function () {
    return srcBox.box !== undefined && dstBox.box !== undefined;
};

MoveCommand.prototype.getSrcBox = function () {
    return srcBox.box;
};

MoveCommand.prototype.getDstBox = function () {
    return dstBox.box;
};

MoveCommand.prototype.getWhere = function () {
    return where;
};